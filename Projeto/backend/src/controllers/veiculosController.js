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
exports.deletarVeiculo = exports.atualizarVeiculo = exports.criarVeiculo = exports.obterVeiculoPorId = exports.obterVeiculos = void 0;
const VeiculosModel_1 = __importDefault(require("../models/VeiculosModel"));
const CategoriaModel_1 = __importDefault(require("../models/CategoriaModel")); // Importando o modelo Categoria
const LocadorasModel_1 = __importDefault(require("../models/LocadorasModel")); // Importando o modelo Locadora
const obterVeiculos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const veiculos = yield VeiculosModel_1.default.findAll({
            include: [
                {
                    model: CategoriaModel_1.default,
                    as: 'categoria', // Nome do relacionamento definido no modelo
                    attributes: ['id', 'nome'], // Campos que você quer retornar de Categoria
                },
                {
                    model: LocadorasModel_1.default,
                    as: 'locadora', // Nome do relacionamento definido no modelo
                    attributes: ['id', 'nome'], // Campos que você quer retornar de Locadora
                },
            ],
        });
        res.status(200).json(veiculos);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao buscar veículos: " + error });
    }
});
exports.obterVeiculos = obterVeiculos;
//Rota para pegar um veículo por ID
const obterVeiculoPorId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const veiculo = yield VeiculosModel_1.default.findByPk(req.params.id);
        if (!veiculo) {
            return res.status(404).json({ error: "Veículo não encontrado" });
        }
        res.status(200).json(veiculo);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao buscar veículo: " + error });
    }
});
exports.obterVeiculoPorId = obterVeiculoPorId;
//Rota para criar um veículo
const criarVeiculo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { marca, modelo, ano, placa, preco_por_dia, imagem, locadora_id, categoria_id } = req.body;
        if (!marca || !modelo || !ano || !placa || !preco_por_dia || !imagem || !locadora_id || !categoria_id) {
            return res.status(400).json({ error: "Todos os campos são obrigatórios" });
        }
        const veiculo = yield VeiculosModel_1.default.create({ marca, modelo, ano, placa, preco_por_dia, imagem, locadora_id, categoria_id });
        res.status(201).json(veiculo);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao criar veículo: " + error });
    }
});
exports.criarVeiculo = criarVeiculo;
// Rota para atualizar um veículo por ID
const atualizarVeiculo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { marca, modelo, ano, placa, preco_por_dia, imagem, locadora_id, categoria_id } = req.body;
        const veiculo = yield VeiculosModel_1.default.findByPk(req.params.id);
        if (!veiculo) {
            return res.status(404).json({ error: "Veículo não encontrado" });
        }
        veiculo.marca = marca;
        veiculo.modelo = modelo;
        veiculo.ano = ano;
        veiculo.placa = placa;
        veiculo.preco_por_dia = preco_por_dia;
        veiculo.imagem = imagem;
        veiculo.locadora_id = locadora_id;
        veiculo.categoria_id = categoria_id;
        yield veiculo.save();
        res.status(200).json(veiculo);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao atualizar veículo: " + error });
    }
});
exports.atualizarVeiculo = atualizarVeiculo;
//Rota para deletar um veículo por ID
const deletarVeiculo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const veiculo = yield VeiculosModel_1.default.findByPk(req.params.id);
        if (!veiculo) {
            return res.status(404).json({ error: "Veículo não encontrado" });
        }
        yield veiculo.destroy();
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao deletar veículo: " + error });
    }
});
exports.deletarVeiculo = deletarVeiculo;
