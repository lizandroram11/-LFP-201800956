"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const analyze_controller_1 = require("../controllers/analyze.controller");
const analyzeRouter = (0, express_1.Router)();
analyzeRouter.post('/analyze', analyze_controller_1.analyze);
exports.default = analyzeRouter;
