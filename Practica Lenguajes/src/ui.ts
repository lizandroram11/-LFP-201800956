import { EditorState } from '@codemirror/state';
import { EditorView, keymap } from '@codemirror/view';
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands';

import { analizarEntrada } from './lexer';
import { extraerPokemones } from './parser';
import { seleccionarTop6 } from './selector';

const limpiarBtn = document.getElementById("limpiarBtn") as HTMLButtonElement;
const cargarArchivo = document.getElementById("cargarArchivo") as HTMLInputElement;
const guardarBtn = document.getElementById("guardarBtn") as HTMLButtonElement;
const analizarBtn = document.getElementById("analizarBtn") as HTMLButtonElement;
const tablaTokens = document.getElementById("tablaTokens") as HTMLTableSectionElement;
const tablaErrores = document.getElementById("tablaErrores") as HTMLTableSectionElement;
const equipoDiv = document.getElementById("equipo") as HTMLDivElement;

const navHome = document.getElementById("navHome") as HTMLAnchorElement;
navHome.addEventListener("click", () => location.reload());


//  Reutilizable para cada nuevo estado
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

// Crear el estado inicial del editor
const editor = new EditorView({
  state: crearEstado(`Jugador: "Ash"
Pokemon: "pikachu" tipo: normal salud: 35 ataque: 55 defensa: 40`),
  parent: document.getElementById('editor')!
});

// Limpiar el editor
limpiarBtn.addEventListener("click", () => {
  editor.setState(crearEstado(""));
});

// Cargar archivo .pklfp
cargarArchivo.addEventListener("change", (event) => {
  const archivo = (event.target as HTMLInputElement).files?.[0];
  if (!archivo) return;

  const reader = new FileReader();
  reader.onload = () => {
    const contenido = reader.result as string;
    editor.setState(crearEstado(contenido));
  };
  reader.readAsText(archivo);
});

// Guardar archivo .pklfp
guardarBtn.addEventListener("click", () => {
  const texto = editor.state.doc.toString();
  const blob = new Blob([texto], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "archivo.pklfp";
  a.click();
  URL.revokeObjectURL(url);
});

// Analizar entrada
analizarBtn.addEventListener("click", async () => {
  const texto = editor.state.doc.toString();
  const tokens = analizarEntrada(texto);
  const pokemones = extraerPokemones(tokens);
  const top6 = seleccionarTop6(pokemones);

  renderTablaTokens(tokens);
  renderErrores(tokens);
  await renderEquipo(top6);
});

// Mostrar tokens
function renderTablaTokens(tokens: any[]) {
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

// Mostrar errores léxicos
function renderErrores(tokens: any[]) {
  tablaErrores.innerHTML = '';
  let index = 1;
  for (const t of tokens) {
    if (t.tipo === 'Desconocido') {
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
}

// Mostrar sprites de Pokémon
async function renderEquipo(pokemones: any[]) {
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

// Obtener sprite desde la PokeAPI
async function obtenerSprite(nombre: string): Promise<string> {
  try {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${nombre}`);
    const data = await res.json();
    return data.sprites.front_default || 'https://via.placeholder.com/96?text=?';
  } catch {
    return 'https://via.placeholder.com/96?text=?';
  }
}

