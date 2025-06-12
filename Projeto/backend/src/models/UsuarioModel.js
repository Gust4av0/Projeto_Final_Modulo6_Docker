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
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database")); // Importando a conexão com o banco
const bcrypt_1 = __importDefault(require("bcrypt"));
class UsuarioModel extends sequelize_1.Model {
    //função para Criptografar a senha
    hashSenha() {
        return __awaiter(this, void 0, void 0, function* () {
            this.senha = yield bcrypt_1.default.hash(this.senha, 10);
        });
    }
    //função para validar a senha, se é diferente
    validaSenha(senha) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield bcrypt_1.default.compare(senha, this.senha);
        });
    }
}
// Definindo o modelo de usuário
UsuarioModel.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nome: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    senha: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    tipo: {
        type: sequelize_1.DataTypes.ENUM('admin', 'cliente'),
        defaultValue: 'cliente', // Valor padrão como 'cliente'
    },
    cpf: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true
    }
}, {
    sequelize: database_1.default, // Passando a instância do sequelize
    modelName: 'UsuarioModel', // Nome do modelo
    tableName: 'usuarios', // Nome da tabela no banco de dados
    timestamps: false
});
//Após criar um usuário, chamar a função para criptrografar 
UsuarioModel.beforeCreate((usuario) => __awaiter(void 0, void 0, void 0, function* () {
    yield usuario.hashSenha();
}));
//Após atualizar um usuário, chamar a função para criptrografar 
UsuarioModel.beforeUpdate((usuario) => __awaiter(void 0, void 0, void 0, function* () {
    if (usuario.changed('senha')) {
        yield usuario.hashSenha();
    }
}));
exports.default = UsuarioModel;
