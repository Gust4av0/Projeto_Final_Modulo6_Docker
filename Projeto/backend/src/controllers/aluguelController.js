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
exports.obterAlugueis = exports.deletarAluguel = exports.atualizarDatasAluguel = exports.criarAluguel = void 0;
const AluguelModel_1 = __importDefault(require("../models/AluguelModel"));
const UsuarioModel_1 = __importDefault(require("../models/UsuarioModel"));
const VeiculosModel_1 = __importDefault(require("../models/VeiculosModel"));
// Criar um aluguel
const criarAluguel = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { usuario_id, veiculo_id, data_inicio, data_fim } = req.body;
        if (!usuario_id || !veiculo_id || !data_inicio || !data_fim) {
            return res
                .status(400)
                .json({ error: "Todos os campos são obrigatórios" });
        }
        const veiculo = yield VeiculosModel_1.default.findByPk(veiculo_id);
        if (!veiculo) {
            return res.status(404).json({ error: "Veículo não encontrado" });
        }
        if (veiculo.alugado) {
            return res.status(400).json({ error: "Veículo já está alugado" });
        }
        const inicio = new Date(data_inicio);
        const fim = new Date(data_fim);
        const umDia = 24 * 60 * 60 * 1000;
        const dias = Math.ceil((fim.getTime() - inicio.getTime()) / umDia);
        if (dias <= 0) {
            return res
                .status(400)
                .json({ error: "A data final deve ser após a data inicial" });
        }
        const valor_total = dias * veiculo.preco_por_dia;
        const aluguel = yield AluguelModel_1.default.create({
            usuario_id,
            veiculo_id,
            data_inicio,
            data_fim,
            valor_total,
        });
        // Atualiza o status do veículo para alugado
        yield VeiculosModel_1.default.update({ alugado: true }, { where: { id: veiculo_id } });
        res.status(201).json(aluguel);
    }
    catch (error) {
        console.error("Erro ao criar aluguel:", error);
        res.status(500).json({ error: "Erro ao criar aluguel" });
    }
});
exports.criarAluguel = criarAluguel;
// Atualizar datas do aluguel
const atualizarDatasAluguel = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { data_inicio, data_fim } = req.body;
        const aluguel = yield AluguelModel_1.default.findByPk(req.params.id);
        if (!aluguel) {
            return res.status(404).json({ error: "Aluguel não encontrado" });
        }
        const inicio = new Date(data_inicio);
        const fim = new Date(data_fim);
        const umDia = 24 * 60 * 60 * 1000;
        const dias = Math.ceil((fim.getTime() - inicio.getTime()) / umDia);
        if (dias <= 0) {
            return res
                .status(400)
                .json({ error: "A data final deve ser após a data inicial" });
        }
        const veiculo = yield VeiculosModel_1.default.findByPk(aluguel.veiculo_id);
        if (!veiculo) {
            return res.status(404).json({ error: "Veículo não encontrado" });
        }
        const novoValorTotal = dias * veiculo.preco_por_dia;
        aluguel.data_inicio = data_inicio;
        aluguel.data_fim = data_fim;
        aluguel.valor_total = novoValorTotal;
        yield aluguel.save();
        res.status(200).json(aluguel);
    }
    catch (error) {
        res
            .status(500)
            .json({ error: "Erro ao atualizar datas do aluguel: " + error });
    }
});
exports.atualizarDatasAluguel = atualizarDatasAluguel;
// Excluir aluguel
const deletarAluguel = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const aluguel = yield AluguelModel_1.default.findByPk(req.params.id);
        if (!aluguel) {
            return res.status(404).json({ error: "Aluguel não encontrado" });
        }
        // Libera o veículo (define alugado como false)
        const veiculo = yield VeiculosModel_1.default.findByPk(aluguel.veiculo_id);
        if (veiculo) {
            yield veiculo.update({ alugado: false });
        }
        yield aluguel.destroy();
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao excluir aluguel: " + error });
    }
});
exports.deletarAluguel = deletarAluguel;
// rota para obter todos os aluguéis
const obterAlugueis = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { veiculo_id, usuario_id } = req.query;
        const where = {};
        if (veiculo_id)
            where.veiculo_id = veiculo_id;
        if (usuario_id)
            where.usuario_id = usuario_id;
        const alugueis = yield AluguelModel_1.default.findAll({
            where,
            include: [
                {
                    model: UsuarioModel_1.default,
                    as: "usuario",
                    attributes: ["id", "nome", "email"],
                },
                {
                    model: VeiculosModel_1.default,
                    as: "veiculo",
                    attributes: ["id", "marca", "modelo", "placa", "imagem"],
                },
            ],
        });
        res.status(200).json(alugueis);
    }
    catch (error) {
        console.error("Erro ao buscar aluguéis:", error);
        res.status(500).json({ error: "Erro ao buscar aluguéis" });
    }
});
exports.obterAlugueis = obterAlugueis;
