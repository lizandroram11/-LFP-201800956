"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const state_1 = require("@codemirror/state");
const view_1 = require("@codemirror/view");
const commands_1 = require("@codemirror/commands");
const lexer_1 = require("./lexer");
const parser_1 = require("./parser");
const selector_1 = require("./selector");
// 🧠 Función reutilizable para crear estado del editor
function crearEstado(doc) {
    return state_1.EditorState.create({
        doc,
        extensions: [
            view_1.keymap.of([...commands_1.defaultKeymap, ...commands_1.historyKeymap]),
            (0, commands_1.history)(),
            view_1.EditorView.lineWrapping
        ]
    });
}
// 📦 Verifica que el div#editor exista antes de crear el editor
const editorContainer = document.getElementById("editor");
let editor;
if (editorContainer) {
    editor = new view_1.EditorView({
        state: crearEstado(""), // Editor vacío al inicio
        parent: editorContainer
    });
}
else {
    console.error("No se encontró el elemento #editor en el HTML.");
}
// 🔗 Referencias del DOM
const limpiarBtn = document.getElementById("limpiarBtn");
const cargarArchivo = document.getElementById("cargarArchivo");
const guardarBtn = document.getElementById("guardarBtn");
const analizarBtn = document.getElementById("analizarBtn");
const tablaTokens = document.getElementById("tablaTokens");
const tablaErrores = document.getElementById("tablaErrores");
const equipoDiv = document.getElementById("equipo");
const navHome = document.getElementById("navHome");
const archivoMenu = document.getElementById("archivoMenu");
const archivoDropdown = document.getElementById("archivoDropdown");
// 🔁 Funcionalidad de menú archivo desplegable (por clic)
if (archivoMenu && archivoDropdown) {
    archivoMenu.addEventListener("click", (e) => {
        e.preventDefault();
        archivoDropdown.classList.toggle("show");
    });
    document.addEventListener("click", (e) => {
        if (!archivoMenu.contains(e.target) &&
            !archivoDropdown.contains(e.target)) {
            archivoDropdown.classList.remove("show");
        }
    });
}
// 🔄 Botón Home
navHome === null || navHome === void 0 ? void 0 : navHome.addEventListener("click", () => location.reload());
// 🧹 Limpiar editor
limpiarBtn === null || limpiarBtn === void 0 ? void 0 : limpiarBtn.addEventListener("click", () => {
    if (editor)
        editor.setState(crearEstado(""));
});
// 📁 Cargar archivo
cargarArchivo === null || cargarArchivo === void 0 ? void 0 : cargarArchivo.addEventListener("change", (event) => {
    var _a;
    const archivo = (_a = event.target.files) === null || _a === void 0 ? void 0 : _a[0];
    if (!archivo)
        return;
    const reader = new FileReader();
    reader.onload = () => {
        const contenido = reader.result;
        if (editor)
            editor.setState(crearEstado(contenido));
    };
    reader.readAsText(archivo);
});
// 💾 Guardar archivo
guardarBtn === null || guardarBtn === void 0 ? void 0 : guardarBtn.addEventListener("click", () => {
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
analizarBtn === null || analizarBtn === void 0 ? void 0 : analizarBtn.addEventListener("click", () => __awaiter(void 0, void 0, void 0, function* () {
    const texto = editor.state.doc.toString();
    const tokens = (0, lexer_1.analizarEntrada)(texto);
    const pokemones = (0, parser_1.extraerPokemones)(tokens);
    const top6 = (0, selector_1.seleccionarTop6)(pokemones);
    renderTablaTokens(tokens);
    renderErrores(tokens);
    yield renderEquipo(top6);
}));
// 🧾 Render tokens
function renderTablaTokens(tokens) {
    if (!tablaTokens)
        return;
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
function renderErrores(tokens) {
    if (!tablaErrores)
        return;
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
function renderEquipo(pokemones) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!equipoDiv)
            return;
        equipoDiv.innerHTML = '';
        for (const p of pokemones) {
            const div = document.createElement('div');
            div.style.display = 'inline-block';
            div.style.margin = '10px';
            div.style.textAlign = 'center';
            const img = yield obtenerSprite(p.nombre.toLowerCase());
            div.innerHTML = `
      <img src="${img}" width="96" height="96"/><br/>
      <strong>${p.nombre}</strong><br/>
      Tipo: ${p.tipo}<br/>
      IVs: ${p.iv.toFixed(2)}%
    `;
            equipoDiv.appendChild(div);
        }
    });
}
// 📷 Obtener sprite desde la PokeAPI
function obtenerSprite(nombre) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const res = yield fetch(`https://pokeapi.co/api/v2/pokemon/${nombre}`);
            const data = yield res.json();
            return data.sprites.front_default || 'https://via.placeholder.com/96?text=?';
        }
        catch (_a) {
            return 'https://via.placeholder.com/96?text=?';
        }
    });
}
