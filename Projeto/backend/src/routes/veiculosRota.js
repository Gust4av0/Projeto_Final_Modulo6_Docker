"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const veiculosController_1 = require("../controllers/veiculosController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
//rota para pegar todos os veículos
router.get("/veiculos", authMiddleware_1.authMiddeleware, veiculosController_1.obterVeiculos);
//rota para pegar veículo por ID
router.get("/veiculos/:id", authMiddleware_1.authMiddeleware, veiculosController_1.obterVeiculoPorId);
//rota para criar um veículo
router.post("/veiculos", authMiddleware_1.authMiddeleware, veiculosController_1.criarVeiculo);
//rota para atualizar um veiculo
router.put("/veiculos/:id", authMiddleware_1.authMiddeleware, veiculosController_1.atualizarVeiculo);
//rota para deletar veículo
router.delete("/veiculos/:id", authMiddleware_1.authMiddeleware, veiculosController_1.deletarVeiculo);
exports.default = router;
