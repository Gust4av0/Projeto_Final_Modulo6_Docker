"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddeleware = void 0;
const jwt_1 = require("../utils/jwt");
const authMiddeleware = (req, res, next) => {
    var _a;
    const token = (_a = req.header('Authorization')) === null || _a === void 0 ? void 0 : _a.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ error: 'Acesso não permitido, não tem Token' });
    }
    try {
        const decoded = (0, jwt_1.verificaToken)(token);
        req.usuario = decoded;
        next();
    }
    catch (error) {
        return res.status(401).json({ msg: 'Acesso não permitido, token inválido!' + error });
    }
};
exports.authMiddeleware = authMiddeleware;
