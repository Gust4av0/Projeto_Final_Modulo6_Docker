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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUsuario = void 0;
const UsuarioModel_1 = __importDefault(require("../models/UsuarioModel"));
const jwt_1 = require("../utils/jwt");
const loginUsuario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, senha } = req.body;
    if (!email || !senha) {
        return res.status(400)
            .json({ error: 'Email e Senha é obrigatório' });
    }
    const usuario = yield UsuarioModel_1.default.findOne({ where: { email } });
    if (!usuario) {
        return res.status(404)
            .json({ error: 'Usuário não existe' });
    }
    const eValidaSenha = yield usuario.validaSenha(senha);
    if (!eValidaSenha) {
        return res.status(400)
            .json({ error: 'Email ou Senha inválidos' });
    }
    const token = (0, jwt_1.gerarToken)(usuario);
    res.status(200).json({
        message: 'Bem-vindo ao sistema!',
        token,
        nome: usuario.nome, // Enviando o nome do usuário no login
        id: usuario.id
    });
});
exports.loginUsuario = loginUsuario;
