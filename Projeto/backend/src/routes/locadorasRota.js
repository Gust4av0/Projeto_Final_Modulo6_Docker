"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const locadoraController_1 = require("../controllers/locadoraController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
//rota para pegar todas as locadoras
router.get("/locadoras", authMiddleware_1.authMiddeleware, locadoraController_1.obterLocadoras);
//rota para pegar locadora por id
router.get("/locadoras/:id", authMiddleware_1.authMiddeleware, locadoraController_1.obterLocadorasId);
//rota para criar uma locadora
router.post("/locadoras", authMiddleware_1.authMiddeleware, locadoraController_1.criarLocadora);
//rota para atualizar locadora
router.put("/locadoras/:id", authMiddleware_1.authMiddeleware, locadoraController_1.atualizarLocadora);
//rota para deletar uma locadora
router.delete("/locadoras/:id", authMiddleware_1.authMiddeleware, locadoraController_1.deletarLocadoraId);
exports.default = router;
