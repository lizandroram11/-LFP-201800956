import { EditorState } from "@codemirror/state";
import { EditorView, keymap } from "@codemirror/view";
import { defaultKeymap, history, historyKeymap } from "@codemirror/commands";
import { analizarEntrada } from "./lexer";
import { extraerPokemones } from "./parser";
import { seleccionarTop6 } from "./selector";

// Crear estado para el editor
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

const editorContainer = document.getElementById("editor");
let editor: EditorView;

if (editorContainer) {
  editor = new EditorView({
    state: crearEstado(""),
    parent: editorContainer
  });
} else {
  console.error("No se encontró el contenedor del editor.");
}

// Referencias
const limpiarBtn = document.getElementById("limpiarBtn") as HTMLButtonElement;
const cargarArchivo = document.getElementById("cargarArchivo") as HTMLInputElement;
const guardarBtn = document.getElementById("guardarBtn") as HTMLButtonElement;
const analizarBtn = document.getElementById("analizarBtn") as HTMLButtonElement;
const tablaTokens = document.getElementById("tablaTokens") as HTMLTableSectionElement;
const tablaErrores = document.getElementById("tablaErrores") as HTMLTableSectionElement;
const equipoDiv = document.getElementById("equipo") as HTMLDivElement;
const navHome = document.getElementById("navHome") as HTMLAnchorElement;
const archivoMenu = document.getElementById("archivoMenu") as HTMLAnchorElement;
const archivoDropdown = document.getElementById("archivoDropdown") as HTMLElement;

// Menú desplegable
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

// Botones
navHome?.addEventListener("click", () => location.reload());

limpiarBtn?.addEventListener("click", () => {
  editor.setState(crearEstado(""));
});

cargarArchivo?.addEventListener("change", (e) => {
  const archivo = (e.target as HTMLInputElement).files?.[0];
  if (!archivo) return;

  const reader = new FileReader();
  reader.onload = () => {
    const texto = reader.result as string;
    editor.setState(crearEstado(texto));
  };
  reader.readAsText(archivo);
});

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

analizarBtn?.addEventListener("click", async () => {
  const texto = editor.state.doc.toString();
  const tokens = analizarEntrada(texto);
  const pokemones = extraerPokemones(tokens);
  const top6 = seleccionarTop6(pokemones);

  renderTablaTokens(tokens);
  renderErrores(tokens);
  await renderEquipo(top6);
});

function renderTablaTokens(tokens: any[]) {
  if (!tablaTokens) return;
  tablaTokens.innerHTML = '';
  tokens.forEach((t, i) => {
    const row = document.createElement("tr");
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

function renderErrores(tokens: any[]) {
  if (!tablaErrores) return;
  tablaErrores.innerHTML = '';
  const errores = tokens.filter(t => t.tipo === "Desconocido");

  if (errores.length === 0) {
    const row = document.createElement("tr");
    row.innerHTML = `<td colspan="5" style="text-align:center;">Sin errores léxicos</td>`;
    tablaErrores.appendChild(row);
    return;
  }

  errores.forEach((t, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${t.fila}</td>
      <td>${t.columna}</td>
      <td>${t.valor}</td>
      <td>Desconocido</td>
    `;
    tablaErrores.appendChild(row);
  });
}

async function renderEquipo(pokemones: any[]) {
  equipoDiv.innerHTML = '';
  for (const p of pokemones) {
    const div = document.createElement("div");
    div.style.display = "inline-block";
    div.style.margin = "10px";
    div.style.textAlign = "center";
    const img = await obtenerSprite(p.nombre.toLowerCase());

    div.innerHTML = `
      <img src="${img}" width="96" height="96" /><br/>
      <strong>${p.nombre}</strong><br/>
      Tipo: ${p.tipo}<br/>
      IVs: ${p.iv.toFixed(2)}%
    `;
    equipoDiv.appendChild(div);
  }
}

async function obtenerSprite(nombre: string): Promise<string> {
  try {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${nombre}`);
    const data = await res.json();
    return data.sprites.front_default || 'https://via.placeholder.com/96?text=?';
  } catch {
    return 'https://via.placeholder.com/96?text=?';
  }
}


export function cargarContenidoEditor(contenido: string) {
  editor.setState(crearEstado(contenido));
}

