"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyze = void 0;
const LexicalAnalyzer_1 = require("../Analyzer/LexicalAnalyzer");
const analyze = (req, res) => {
    const input = req.body;
    let lexicalAnalyze = new LexicalAnalyzer_1.LexicalAnalyze();
    let tokenList = lexicalAnalyze.scanner(input);
    res.json({
        "tokens": tokenList,
        "errors": lexicalAnalyze.getErrorList()
    });
};
exports.analyze = analyze;
