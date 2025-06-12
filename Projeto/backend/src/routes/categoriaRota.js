"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const categoriaController_1 = require("../controllers/categoriaController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
//obter todas as categorias
router.get("/categorias", authMiddleware_1.authMiddeleware, categoriaController_1.obterCategorias);
//obter categoria por ID
router.get("/categorias/:id", authMiddleware_1.authMiddeleware, categoriaController_1.obterCategoriaId);
//criar uma categoria
router.post("/categorias", authMiddleware_1.authMiddeleware, categoriaController_1.criarCategoria);
//atualizar uma categorai
router.put("/categorias/:id", authMiddleware_1.authMiddeleware, categoriaController_1.atualizarCategoria);
//deletar uma categoria
router.delete("/categorias/:id", authMiddleware_1.authMiddeleware, categoriaController_1.deletarCategoriaId);
exports.default = router;
