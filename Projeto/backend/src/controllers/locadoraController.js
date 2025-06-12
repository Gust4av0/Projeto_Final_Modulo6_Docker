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
exports.deletarLocadoraId = exports.atualizarLocadora = exports.criarLocadora = exports.obterLocadorasId = exports.obterLocadoras = void 0;
const LocadorasModel_1 = __importDefault(require("../models/LocadorasModel"));
//rota para pegar todas as locadoras
const obterLocadoras = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const locadoras = yield LocadorasModel_1.default.findAll();
    res.send(locadoras);
});
exports.obterLocadoras = obterLocadoras;
//rota para pegar as locadoras por ID
const obterLocadorasId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const locadoras = yield LocadorasModel_1.default.findByPk(req.params.id);
    return res.json(locadoras);
});
exports.obterLocadorasId = obterLocadorasId;
//rota para criar uma locadora
const criarLocadora = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { nome, cidade, estado } = req.body;
        if (!nome || nome === '') {
            return res.status(400)
                .json({ error: 'Propiedade não pode ser vazio' });
        }
        const locadora = yield LocadorasModel_1.default.create({ nome, cidade, estado });
        res.status(201).json(locadora);
    }
    catch (error) {
        res.status(500).json('Erro interno no servidor' + error);
    }
});
exports.criarLocadora = criarLocadora;
//rota para atualizar uma locadora
const atualizarLocadora = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { nome, cidade, estado } = req.body;
        if (!nome || nome === '') {
            return res.status(400)
                .json({ error: 'Propiedade não pode ser vazio' });
        }
        const locadora = yield LocadorasModel_1.default.findByPk(req.params.id);
        if (!locadora) {
            return res.status(400)
                .json({ error: 'Usuário não existe' });
        }
        locadora.nome = nome;
        locadora.cidade = cidade;
        locadora.estado = estado;
        yield locadora.save();
        res.status(201).json(locadora);
    }
    catch (error) {
        res.status(500).json('Erro interno no servidor' + error);
    }
});
exports.atualizarLocadora = atualizarLocadora;
//rota para deletar uma locadora
const deletarLocadoraId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const locadora = yield LocadorasModel_1.default.findByPk(req.params.id);
        if (!locadora) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }
        yield locadora.destroy();
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({ error: 'Erro interno no sevidor' + error });
    }
});
exports.deletarLocadoraId = deletarLocadoraId;
