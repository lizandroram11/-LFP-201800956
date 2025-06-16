import express from 'express';
//import analyzeRouter from './routes/aplication.route';
import analyzeRouter from './routes/analyze.routes';


const app = express(); //crea el servidor
const PORT = 3000;

app.use(express.text());
app.use(analyzeRouter);

app.listen(PORT, () => {
    console.log(`The server is running on http://localhost:${PORT}`);
});