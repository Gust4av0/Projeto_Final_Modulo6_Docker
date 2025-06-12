"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const usuarioController_1 = require("../controllers/usuarioController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
//rota pública 
router.post("/usuarios", usuarioController_1.criarUsuario);
//rotas privadas 
router.get("/usuarios", authMiddleware_1.authMiddeleware, usuarioController_1.obterUsuarios);
router.get("/usuarios/:id", authMiddleware_1.authMiddeleware, usuarioController_1.obterUsuarioId);
router.put("/usuarios/:id", authMiddleware_1.authMiddeleware, usuarioController_1.atualizarUsuario);
router.delete("/usuarios/:id", authMiddleware_1.authMiddeleware, usuarioController_1.deletarUsuarioId);
exports.default = router;
