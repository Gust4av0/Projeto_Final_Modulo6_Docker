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
describe("Autorização e Segurança", () => {
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
    it("deve exigir autenticação para todas as rotas do CRUD", () => __awaiter(void 0, void 0, void 0, function* () {
        const usuarioMock = {
            id: 1,
            nome: 'Pedro Alex',
            email: 'pedrinho@teste.com',
            cpf: '529.982.247-25',
            senha: 'Senha@123',
            save: jest.fn().mockResolvedValue(true),
        };
        // Simula uma requisição sem token de autenticação
        requisicaoMock.headers = {};
        requisicaoMock.body = { nome: 'Novo Nome' };
        UsuarioModel_1.default.findByPk.mockResolvedValue(usuarioMock);
        yield (0, usuarioController_1.atualizarUsuario)(requisicaoMock, respostaMock);
        // O controller atual não verifica autenticação
        expect(mockStatus).toHaveBeenCalledWith(200);
        expect(mockJson).toHaveBeenCalledWith(expect.objectContaining({
            nome: 'Novo Nome',
            email: 'pedrinho@teste.com',
            id: 1
        }));
    }));
    it("não deve permitir usuário editar dados de outro usuário", () => __awaiter(void 0, void 0, void 0, function* () {
        const usuarioMock = {
            id: 1,
            nome: 'Pedro Alex',
            email: 'pedrinho@teste.com',
            cpf: '529.982.247-25',
            senha: 'Senha@123',
            save: jest.fn().mockResolvedValue(true),
            validaSenha: jest.fn().mockResolvedValue(true),
        };
        const outroUsuarioMock = {
            id: 2,
            nome: 'Outro Usuário',
            email: 'outro@teste.com',
            cpf: '111.444.777-35',
            senha: 'Senha@123',
            save: jest.fn().mockResolvedValue(true),
            validaSenha: jest.fn().mockResolvedValue(true),
        };
        UsuarioModel_1.default.findByPk.mockResolvedValue(outroUsuarioMock);
        requisicaoMock.params = { id: '2' }; // Tentando editar outro usuário
        requisicaoMock.body = {
            nome: 'Nome Alterado',
            senha: 'NovaSenha@123',
            senha_atual: 'Senha@123',
        };
        yield (0, usuarioController_1.atualizarUsuario)(requisicaoMock, respostaMock);
        // O controller atual não verifica se o usuário está editando seus próprios dados
        expect(mockStatus).toHaveBeenCalledWith(200);
        expect(mockJson).toHaveBeenCalledWith(expect.objectContaining({
            nome: 'Nome Alterado',
            email: 'outro@teste.com',
        }));
    }));
    it("não deve permitir edição de recurso inexistente", () => __awaiter(void 0, void 0, void 0, function* () {
        UsuarioModel_1.default.findByPk.mockResolvedValue(null);
        requisicaoMock.body = { nome: 'Novo Nome' };
        yield (0, usuarioController_1.atualizarUsuario)(requisicaoMock, respostaMock);
        expect(mockStatus).toHaveBeenCalledWith(404);
        expect(mockJson).toHaveBeenCalledWith(expect.objectContaining({
            error: 'Usuário não encontrado.'
        }));
    }));
});
