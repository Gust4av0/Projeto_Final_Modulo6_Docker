"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
const UsuarioModel_1 = __importDefault(require("./UsuarioModel"));
const VeiculosModel_1 = __importDefault(require("./VeiculosModel"));
class AluguelModel extends sequelize_1.Model {
}
AluguelModel.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    alugado: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    usuario_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: UsuarioModel_1.default,
            key: "id",
        },
    },
    veiculo_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: VeiculosModel_1.default,
            key: "id",
        },
    },
    data_inicio: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
    },
    data_fim: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
    },
    valor_total: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false,
    },
}, {
    sequelize: database_1.default,
    modelName: "AluguelModel",
    tableName: "aluguéis",
    timestamps: false,
});
// Relacionamentos
AluguelModel.belongsTo(UsuarioModel_1.default, { foreignKey: "usuario_id", as: "usuario" });
AluguelModel.belongsTo(VeiculosModel_1.default, { foreignKey: "veiculo_id", as: "veiculo" });
exports.default = AluguelModel;
