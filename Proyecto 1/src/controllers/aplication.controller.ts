import { Request, Response } from "express";
import { LexicalAnalyze } from "../Analyzer/LexicalAnalyzer";
import { Token } from "../Analyzer/Token";

export const putos = (req: Request, res: Response) => {
    res.send("USAC")
}