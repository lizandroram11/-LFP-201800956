import { EditorState } from "@codemirror/state";
import { EditorView, keymap } from "@codemirror/view";
import { defaultKeymap, history, historyKeymap } from "@codemirror/commands";
import { analizarEntrada } from "./lexer";
import { extraerPokemones } from "./parser";
import { seleccionarTop6 } from "./selector";

// 🧠 Función reutilizable para crear estado del editor
function crearEstado(doc: string): EditorState {
  return EditorState.create({
    doc,
    extensions: [
      keymap.of([...defaultKeymap, ...historyKeymap]),
      history(),
      EditorView.lineWrapping
    ]
  });
}

// 📦 Verifica que el div#editor exista antes de crear el editor
const editorContainer = document.getElementById("editor");
let editor: EditorView;

if (editorContainer) {
  editor = new EditorView({
    state: crearEstado(""), // Editor vacío al inicio
    parent: editorContainer
  });
} else {
  console.error("No se encontró el elemento #editor en el HTML.");
}

// 🔗 Referencias del DOM
const limpiarBtn = document.getElementById("limpiarBtn") as HTMLButtonElement | null;
const cargarArchivo = document.getElementById("cargarArchivo") as HTMLInputElement | null;
const guardarBtn = document.getElementById("guardarBtn") as HTMLButtonElement | null;
const analizarBtn = document.getElementById("analizarBtn") as HTMLButtonElement | null;
const tablaTokens = document.getElementById("tablaTokens") as HTMLTableSectionElement | null;
const tablaErrores = document.getElementById("tablaErrores") as HTMLTableSectionElement | null;
const equipoDiv = document.getElementById("equipo") as HTMLDivElement | null;
const navHome = document.getElementById("navHome") as HTMLAnchorElement | null;
const archivoMenu = document.getElementById("archivoMenu") as HTMLAnchorElement | null;
const archivoDropdown = document.getElementById("archivoDropdown") as HTMLElement | null;

// 🔁 Funcionalidad de menú archivo desplegable (por clic)
if (archivoMenu && archivoDropdown) {
  archivoMenu.addEventListener("click", (e) => {
    e.preventDefault();
    archivoDropdown.classList.toggle("show");
  });

  document.addEventListener("click", (e) => {
    if (
      !archivoMenu.contains(e.target as Node) &&
      !archivoDropdown.contains(e.target as Node)
    ) {
      archivoDropdown.classList.remove("show");
    }
  });
}

// 🔄 Botón Home
navHome?.addEventListener("click", () => location.reload());

// 🧹 Limpiar editor
limpiarBtn?.addEventListener("click", () => {
  if (editor) editor.setState(crearEstado(""));
});

// 📁 Cargar archivo
cargarArchivo?.addEventListener("change", (event) => {
  const archivo = (event.target as HTMLInputElement).files?.[0];
  if (!archivo) return;

  const reader = new FileReader();
  reader.onload = () => {
    const contenido = reader.result as string;
    if (editor) editor.setState(crearEstado(contenido));
  };
  reader.readAsText(archivo);
});

// 💾 Guardar archivo
guardarBtn?.addEventListener("click", () => {
  const texto = editor.state.doc.toString();
  const blob = new Blob([texto], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "archivo.pklfp";
  a.click();
  URL.revokeObjectURL(url);
});

// 🔍 Analizar archivo
analizarBtn?.addEventListener("click", async () => {
  const texto = editor.state.doc.toString();
  const tokens = analizarEntrada(texto);
  const pokemones = extraerPokemones(tokens);
  const top6 = seleccionarTop6(pokemones);

  renderTablaTokens(tokens);
  renderErrores(tokens);
  await renderEquipo(top6);
});

// 🧾 Render tokens
function renderTablaTokens(tokens: any[]) {
  if (!tablaTokens) return;
  tablaTokens.innerHTML = '';
  tokens.forEach((t, i) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${i + 1}</td>
      <td>${t.fila}</td>
      <td>${t.columna}</td>
      <td>${t.valor}</td>
      <td>${t.tipo}</td>
    `;
    tablaTokens.appendChild(row);
  });
}

// ⚠️ Render errores
function renderErrores(tokens: any[]) {
  if (!tablaErrores) return;
  tablaErrores.innerHTML = '';
  let index = 1;
  const errores = tokens.filter(t => t.tipo === 'Desconocido');

  if (errores.length === 0) {
    const row = document.createElement('tr');
    row.innerHTML = `<td colspan="5" style="text-align:center;">Sin errores léxicos</td>`;
    tablaErrores.appendChild(row);
    return;
  }

  for (const t of errores) {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${index++}</td>
      <td>${t.fila}</td>
      <td>${t.columna}</td>
      <td>${t.valor}</td>
      <td>Desconocido</td>
    `;
    tablaErrores.appendChild(row);
  }
}

// 🧬 Mostrar equipo Pokémon
async function renderEquipo(pokemones: any[]) {
  if (!equipoDiv) return;
  equipoDiv.innerHTML = '';
  for (const p of pokemones) {
    const div = document.createElement('div');
    div.style.display = 'inline-block';
    div.style.margin = '10px';
    div.style.textAlign = 'center';
    const img = await obtenerSprite(p.nombre.toLowerCase());
    div.innerHTML = `
      <img src="${img}" width="96" height="96"/><br/>
      <strong>${p.nombre}</strong><br/>
      Tipo: ${p.tipo}<br/>
      IVs: ${p.iv.toFixed(2)}%
    `;
    equipoDiv.appendChild(div);
  }
}

// 📷 Obtener sprite desde la PokeAPI
async function obtenerSprite(nombre: string): Promise<string> {
  try {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${nombre}`);
    const data = await res.json();
    return data.sprites.front_default || 'https://via.placeholder.com/96?text=?';
  } catch {
    return 'https://via.placeholder.com/96?text=?';
  }
}