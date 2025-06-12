"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
const CategoriaModel_1 = __importDefault(require("./CategoriaModel"));
const LocadorasModel_1 = __importDefault(require("./LocadorasModel"));
class VeiculosModel extends sequelize_1.Model {
}
VeiculosModel.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    marca: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    modelo: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    ano: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    placa: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    preco_por_dia: {
        type: sequelize_1.DataTypes.FLOAT //VERIFICAR
    },
    imagem: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    locadora_id: {
        type: sequelize_1.DataTypes.INTEGER,
        references: {
            model: LocadorasModel_1.default,
            key: "id",
        },
        allowNull: false,
    },
    categoria_id: {
        type: sequelize_1.DataTypes.INTEGER,
        references: {
            model: CategoriaModel_1.default,
            key: "id",
        },
        allowNull: false,
    },
    alugado: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
    },
}, {
    sequelize: database_1.default,
    modelName: "VeiculosModel",
    tableName: "veiculos",
    timestamps: false,
});
//  Um Veículo pertence a UMA Locadora (N:1)
VeiculosModel.belongsTo(LocadorasModel_1.default, { foreignKey: "locadora_id", as: "locadora" });
//  Um Veículo pertence a UMA Categoria (N:1)
VeiculosModel.belongsTo(CategoriaModel_1.default, { foreignKey: "categoria_id", as: "categoria" });
exports.default = VeiculosModel;
