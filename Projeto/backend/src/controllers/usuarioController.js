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
exports.deletarUsuarioId = exports.atualizarUsuario = exports.criarUsuario = exports.obterUsuarioId = exports.obterUsuarios = void 0;
const UsuarioModel_1 = __importDefault(require("../models/UsuarioModel"));
const validacoes_1 = require("../utils/validacoes");
const userCache = {};
const CACHE_TTL = 30000;
//rota para pegar todos os usuários
const obterUsuarios = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const usuarios = yield UsuarioModel_1.default.findAll();
    res.send(usuarios);
});
exports.obterUsuarios = obterUsuarios;
//rota para pegar um usuário pelo id
const obterUsuarioId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.id;
        const now = Date.now();
        const cachedUser = userCache[userId];
        if (cachedUser && now - cachedUser.timestamp < CACHE_TTL) {
            return res.json(cachedUser.data);
        }
        const usuario = yield UsuarioModel_1.default.findByPk(userId);
        if (!usuario) {
            return res.status(404).json({ error: "Usuário não encontrado" });
        }
        const usuarioSemSenha = {
            id: usuario.id,
            nome: usuario.nome,
            email: usuario.email,
            tipo: usuario.tipo,
            cpf: usuario.cpf,
        };
        userCache[userId] = {
            data: usuarioSemSenha,
            timestamp: now,
        };
        return res.json(usuarioSemSenha);
    }
    catch (error) {
        console.error("Erro ao buscar usuário:", error);
        return res.status(500).json({ error: "Erro interno no servidor" });
    }
});
exports.obterUsuarioId = obterUsuarioId;
//rota para criar um usuário
const criarUsuario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { nome, email, senha, cpf } = req.body;
        if (!nome || !email || !senha || !cpf) {
            return res.status(400).json({ error: "Nenhum campo pode estar vazio." });
        }
        if (!(0, validacoes_1.validarEmail)(email)) {
            return res.status(400).json({ error: "E-mail inválido." });
        }
        if (!(0, validacoes_1.validarCPF)(cpf)) {
            return res.status(400).json({ error: "CPF inválido." });
        }
        if (!(0, validacoes_1.validarSenhaForte)(senha)) {
            return res.status(400).json({
                error: "A senha deve ter no mínimo 8 caracteres, 1 número, 1 letra maiúscula e 1 símbolo.",
            });
        }
        const usuario = yield UsuarioModel_1.default.create({ nome, email, senha, cpf });
        res.status(201).json(usuario);
    }
    catch (error) {
        res.status(500).json({ error: "Erro interno no servidor: " + error });
    }
});
exports.criarUsuario = criarUsuario;
//rota para atualizar um usuário
const atualizarUsuario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { nome, cpf, senha, senha_atual } = req.body;
        // Buscar o usuário pelo ID
        const usuario = yield UsuarioModel_1.default.findByPk(req.params.id);
        if (!usuario) {
            return res.status(404).json({ error: "Usuário não encontrado." });
        }
        // Se estiver tentando atualizar o nome
        if (nome && nome !== "") {
            usuario.nome = nome;
        }
        // Se estiver tentando atualizar o CPF
        if (cpf) {
            if (!(0, validacoes_1.validarCPF)(cpf)) {
                return res.status(400).json({ error: "CPF inválido." });
            }
            usuario.cpf = cpf;
        }
        // Se estiver tentando atualizar a senha
        if (senha) {
            // Verificar se a senha atual foi fornecida
            if (!senha_atual) {
                return res
                    .status(400)
                    .json({ error: "Senha atual é necessária para alterar a senha." });
            }
            // Validar a senha atual
            const senhaValida = yield usuario.validaSenha(senha_atual);
            if (!senhaValida) {
                return res.status(400).json({ error: "Senha atual incorreta." });
            }
            // Validar a força da nova senha
            if (!(0, validacoes_1.validarSenhaForte)(senha)) {
                return res.status(400).json({
                    error: "A senha deve ter no mínimo 8 caracteres, 1 número, 1 letra maiúscula e 1 símbolo.",
                });
            }
            usuario.senha = senha;
        }
        yield usuario.save();
        // Retornar o usuário sem a senha
        const usuarioAtualizado = {
            id: usuario.id,
            nome: usuario.nome,
            email: usuario.email,
            cpf: usuario.cpf,
            tipo: usuario.tipo,
        };
        res.status(200).json(usuarioAtualizado);
    }
    catch (error) {
        console.error("Erro ao atualizar usuário:", error);
        res.status(500).json({ error: "Erro interno no servidor: " + error });
    }
});
exports.atualizarUsuario = atualizarUsuario;
//rota para deletar um usuário
const deletarUsuarioId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const usuario = yield UsuarioModel_1.default.findByPk(req.params.id);
        if (!usuario) {
            return res.status(404).json({ error: "Usuário não encontrado" });
        }
        yield usuario.destroy();
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({ error: "Erro interno no sevidor" + error });
    }
});
exports.deletarUsuarioId = deletarUsuarioId;
