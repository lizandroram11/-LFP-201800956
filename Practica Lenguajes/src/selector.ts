import { Pokemon } from './pokemon';

export function seleccionarTop6(pokemones: Pokemon[]): Pokemon[] {
  const sinRepetidos: Record<string, Pokemon> = {};

  // Quedarse con el de mayor IV por tipo
  for (const p of pokemones) {
    if (!sinRepetidos[p.tipo] || p.iv > sinRepetidos[p.tipo].iv) {
      sinRepetidos[p.tipo] = p;
    }
  }

  // Convertir a array y tomar los 6 mejores
  const finalistas = Object.values(sinRepetidos);
  finalistas.sort((a, b) => b.iv - a.iv);

  return finalistas.slice(0, 6);
}
