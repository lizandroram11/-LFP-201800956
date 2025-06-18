import express from 'express';
//import analyzeRouter from './routes/aplication.route';
import analyzeRouter from './routes/analyze.routes';
import path from 'path';

const app = express(); //crea el servidor
const PORT = 3000;

app.use(express.text());

app.use(express.static(path.join(__dirname, '../public'))); //servir archivos estaticos

app.use(analyzeRouter);

app.listen(PORT, () => {
    console.log(`The server is running on http://localhost:${PORT}`);
});
