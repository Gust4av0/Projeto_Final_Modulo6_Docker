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
exports.deletarCategoriaId = exports.atualizarCategoria = exports.criarCategoria = exports.obterCategoriaId = exports.obterCategorias = void 0;
const CategoriaModel_1 = __importDefault(require("../models/CategoriaModel"));
//rota para pegar todas as categorias
const obterCategorias = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const categorias = yield CategoriaModel_1.default.findAll();
    res.send(categorias);
});
exports.obterCategorias = obterCategorias;
//rota para pegar as categorias por ID
const obterCategoriaId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const categoria = yield CategoriaModel_1.default.findByPk(req.params.id);
    return res.json(categoria);
});
exports.obterCategoriaId = obterCategoriaId;
//rota para criar uma categoria
const criarCategoria = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { nome } = req.body;
        if (!nome || nome === '') {
            return res.status(400)
                .json({ error: 'Propiedade não pode ser vazio' });
        }
        const categoria = yield CategoriaModel_1.default.create({ nome });
        res.status(201).json(categoria);
    }
    catch (error) {
        res.status(500).json('Erro interno no servidor' + error);
    }
});
exports.criarCategoria = criarCategoria;
//rota para atualizar uma categoria
const atualizarCategoria = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { nome } = req.body;
        if (!nome || nome === '') {
            return res.status(400)
                .json({ error: 'Propiedade não pode ser vazio' });
        }
        const categoria = yield CategoriaModel_1.default.findByPk(req.params.id);
        if (!categoria) {
            return res.status(400)
                .json({ error: 'Usuário não existe' });
        }
        categoria.nome = nome;
        yield categoria.save();
        res.status(201).json(categoria);
    }
    catch (error) {
        res.status(500).json('Erro interno no servidor' + error);
    }
});
exports.atualizarCategoria = atualizarCategoria;
//rota para deletar uma categoria
const deletarCategoriaId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categoria = yield CategoriaModel_1.default.findByPk(req.params.id);
        if (!categoria) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }
        yield categoria.destroy();
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({ error: 'Erro interno no sevidor' + error });
    }
});
exports.deletarCategoriaId = deletarCategoriaId;
