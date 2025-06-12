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
const usuarioController_1 = require("../src/controllers/usuarioController");
const UsuarioModel_1 = __importDefault(require("../src/models/UsuarioModel"));
// Mock do modelo de usuário
jest.mock('../src/models/UsuarioModel');
describe("Cadastro de Usuário", () => {
    let requisicaoMock;
    let respostaMock;
    let mockJson;
    let mockStatus;
    beforeEach(() => {
        mockJson = jest.fn();
        mockStatus = jest.fn().mockReturnThis();
        respostaMock = {
            json: mockJson,
            status: mockStatus,
        };
        requisicaoMock = {
            body: {},
        };
    });
    it("deve criar um novo usuário com dados válidos", () => __awaiter(void 0, void 0, void 0, function* () {
        const usuarioMock = {
            id: 1,
            nome: 'Pedro Alex',
            email: 'pedrinho@teste.com',
            cpf: '529.982.247-25',
            senha: 'Senha@123',
        };
        UsuarioModel_1.default.create.mockResolvedValue(usuarioMock);
        requisicaoMock.body = usuarioMock;
        yield (0, usuarioController_1.criarUsuario)(requisicaoMock, respostaMock);
        expect(mockStatus).toHaveBeenCalledWith(201);
        expect(mockJson).toHaveBeenCalledWith(usuarioMock);
    }));
    it("não deve criar usuário com CPF inválido", () => __awaiter(void 0, void 0, void 0, function* () {
        requisicaoMock.body = {
            nome: 'Pedro Alex',
            email: 'pedrinho@teste.com',
            cpf: '111.111.111-11',
            senha: 'Senha@123',
        };
        yield (0, usuarioController_1.criarUsuario)(requisicaoMock, respostaMock);
        expect(mockStatus).toHaveBeenCalledWith(400);
        expect(mockJson).toHaveBeenCalledWith(expect.objectContaining({
            error: 'CPF inválido.'
        }));
    }));
});
describe("Edição de Usuário", () => {
    let requisicaoMock;
    let respostaMock;
    let mockJson;
    let mockStatus;
    beforeEach(() => {
        mockJson = jest.fn();
        mockStatus = jest.fn().mockReturnThis();
        respostaMock = {
            json: mockJson,
            status: mockStatus,
        };
        requisicaoMock = {
            params: { id: '1' },
            body: {},
        };
    });
    it("deve permitir usuário editar seus próprios dados", () => __awaiter(void 0, void 0, void 0, function* () {
        const usuarioMock = {
            id: 1,
            nome: 'Pedro Alex',
            email: 'pedrinho@teste.com',
            cpf: '529.982.247-25',
            senha: 'Senha@123',
            save: jest.fn().mockResolvedValue(true),
            validaSenha: jest.fn().mockResolvedValue(true),
        };
        UsuarioModel_1.default.findByPk.mockResolvedValue(usuarioMock);
        requisicaoMock.body = {
            nome: 'Novo Nome',
            senha: 'NovaSenha@123',
            senha_atual: 'Senha@123',
        };
        yield (0, usuarioController_1.atualizarUsuario)(requisicaoMock, respostaMock);
        expect(mockStatus).toHaveBeenCalledWith(200);
        expect(mockJson).toHaveBeenCalledWith(expect.objectContaining({
            nome: 'Novo Nome',
            email: 'pedrinho@teste.com',
        }));
    }));
    it("não deve permitir alteração de email", () => __awaiter(void 0, void 0, void 0, function* () {
        const usuarioMock = {
            id: 1,
            nome: 'Pedro Alex',
            email: 'pedrinho@teste.com',
            cpf: '529.982.247-25',
            senha: 'Senha@123',
            save: jest.fn().mockResolvedValue(true),
        };
        UsuarioModel_1.default.findByPk.mockResolvedValue(usuarioMock);
        requisicaoMock.body = {
            email: 'novo@teste.com',
        };
        yield (0, usuarioController_1.atualizarUsuario)(requisicaoMock, respostaMock);
        expect(mockJson).toHaveBeenCalledWith(expect.objectContaining({
            email: 'pedrinho@teste.com', // Email não deve ter mudado
        }));
    }));
    it("deve validar todos os campos obrigatórios na edição", () => __awaiter(void 0, void 0, void 0, function* () {
        const usuarioMock = {
            id: 1,
            nome: 'Pedro Alex',
            email: 'pedrinho@teste.com',
            cpf: '529.982.247-25',
            senha: 'Senha@123',
            save: jest.fn().mockResolvedValue(true),
        };
        UsuarioModel_1.default.findByPk.mockResolvedValue(usuarioMock);
        requisicaoMock.body = {
            nome: '', // Nome vazio
            cpf: '', // CPF vazio
        };
        yield (0, usuarioController_1.atualizarUsuario)(requisicaoMock, respostaMock);
        // O controller mantém os valores originais quando campos estão vazios
        expect(mockStatus).toHaveBeenCalledWith(200);
        expect(mockJson).toHaveBeenCalledWith(expect.objectContaining({
            nome: 'Pedro Alex',
            cpf: '529.982.247-25',
            email: 'pedrinho@teste.com',
            id: 1
        }));
    }));
});
describe("Exclusão de Usuário", () => {
    let requisicaoMock;
    let respostaMock;
    let mockJson;
    let mockStatus;
    beforeEach(() => {
        mockJson = jest.fn();
        mockStatus = jest.fn().mockReturnThis();
        respostaMock = {
            json: mockJson,
            status: mockStatus,
        };
        requisicaoMock = {
            params: { id: '1' },
        };
    });
    it("não deve permitir exclusão de recurso inexistente", () => __awaiter(void 0, void 0, void 0, function* () {
        UsuarioModel_1.default.findByPk.mockResolvedValue(null);
        yield (0, usuarioController_1.deletarUsuarioId)(requisicaoMock, respostaMock);
        expect(mockStatus).toHaveBeenCalledWith(404);
        expect(mockJson).toHaveBeenCalledWith(expect.objectContaining({
            error: 'Usuário não encontrado'
        }));
    }));
});
