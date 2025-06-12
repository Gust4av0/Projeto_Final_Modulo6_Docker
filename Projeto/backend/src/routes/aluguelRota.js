"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const aluguelController_1 = require("../controllers/aluguelController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
// Criar um novo aluguel
router.post('/alugueis', authMiddleware_1.authMiddeleware, aluguelController_1.criarAluguel);
// Atualizar datas de um aluguel existente
router.put('/alugueis/:id', authMiddleware_1.authMiddeleware, aluguelController_1.atualizarDatasAluguel);
// Deletar um aluguel
router.delete('/alugueis/:id', authMiddleware_1.authMiddeleware, aluguelController_1.deletarAluguel);
// (Opcional) Obter todos os aluguéis com info de usuário e veículo
router.get('/alugueis', authMiddleware_1.authMiddeleware, aluguelController_1.obterAlugueis);
exports.default = router;
