"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
//import analyzeRouter from './routes/aplication.route';
const analyze_routes_1 = __importDefault(require("./routes/analyze.routes"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)(); //crea el servidor
const PORT = 3000;
app.use(express_1.default.text());
app.use(express_1.default.static(path_1.default.join(__dirname, '../public'))); //servir archivos estaticos
app.use(analyze_routes_1.default);
app.listen(PORT, () => {
    console.log(`The server is running on http://localhost:${PORT}`);
});
