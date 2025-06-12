import { Pokemon } from './pokemon';
import { analizarEntrada } from './lexer';
import { extraerPokemones } from './parser';
import { cargarContenidoEditor } from './ui';

// Función principal para manejar archivo cargado desde main.ts
export async function handleFileUpload(content: string): Promise<void> {
  // Mostrar el contenido en el editor
  cargarContenidoEditor(content);

  // Procesar tokens y Pokémon
  const tokens = analizarEntrada(content);
  const pokemones = extraerPokemones(tokens);
  const top6 = seleccionarTop6(pokemones);
  

  // Actualizar tablas y visualización
  renderTablaTokens(tokens);
  renderErrores(tokens);
  await renderEquipo(top6);
}

// 🧠 Lógica para seleccionar los mejores 6 Pokémon (uno por tipo con mayor IV)
export function seleccionarTop6(pokemones: Pokemon[]): Pokemon[] {
  const sinRepetidos: Record<string, Pokemon> = {};

  for (const p of pokemones) {
    if (!sinRepetidos[p.tipo] || p.iv > sinRepetidos[p.tipo].iv) {
      sinRepetidos[p.tipo] = p;
    }
  }

  const finalistas = Object.values(sinRepetidos);
  finalistas.sort((a, b) => b.iv - a.iv);

  return finalistas.slice(0, 6);
}

// Helpers de UI — similares a los de ui.ts pero reutilizados desde aquí

function renderTablaTokens(tokens: any[]) {
  const tablaTokens = document.getElementById("tablaTokens") as HTMLTableSectionElement | null;
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

function renderErrores(tokens: any[]) {
  const tablaErrores = document.getElementById("tablaErrores") as HTMLTableSectionElement | null;
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

async function renderEquipo(pokemones: any[]) {
  const equipoDiv = document.getElementById("equipo") as HTMLDivElement | null;
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

async function obtenerSprite(nombre: string): Promise<string> {
  try {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${nombre}`);
    const data = await res.json();
    return data.sprites.front_default || 'https://via.placeholder.com/96?text=?';
  } catch {
    return 'https://via.placeholder.com/96?text=?';
  }
}
