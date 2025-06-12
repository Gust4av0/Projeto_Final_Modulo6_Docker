"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verificaToken = exports.gerarToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || 'segredo_do_segredo';
//quantidade de dias para a senha/token expirar 
const JWT_EXPIRES_IN = '7d';
const gerarToken = (usuario) => {
    return jsonwebtoken_1.default.sign({ usuario }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};
exports.gerarToken = gerarToken;
const verificaToken = (token) => {
    return jsonwebtoken_1.default.verify(token, JWT_SECRET);
};
exports.verificaToken = verificaToken;
