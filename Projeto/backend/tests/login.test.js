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
const loginController_1 = require("../src/controllers/loginController");
const UsuarioModel_1 = __importDefault(require("../src/models/UsuarioModel"));
// Mock do modelo de usuário
jest.mock('../src/models/UsuarioModel');
describe("Autenticação", () => {
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
    describe("Login", () => {
        it("deve permitir login com email e senha válidos", () => __awaiter(void 0, void 0, void 0, function* () {
            const usuarioMock = {
                id: 1,
                email: 'pedrinho@teste.com',
                senha: 'Senha@123',
                nome: 'Pedro Alex',
                validaSenha: jest.fn().mockResolvedValue(true),
            };
            UsuarioModel_1.default.findOne.mockResolvedValue(usuarioMock);
            requisicaoMock.body = { email: 'pedrinho@teste.com', senha: 'Senha@123' };
            yield (0, loginController_1.loginUsuario)(requisicaoMock, respostaMock);
            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith(expect.objectContaining({
                message: 'Bem-vindo ao sistema!',
                nome: 'Pedro Alex',
                id: 1,
            }));
        }));
        it("não deve permitir login com email não cadastrado", () => __awaiter(void 0, void 0, void 0, function* () {
            UsuarioModel_1.default.findOne.mockResolvedValue(null);
            requisicaoMock.body = { email: 'naoexiste@teste.com', senha: 'Senha@123' };
            yield (0, loginController_1.loginUsuario)(requisicaoMock, respostaMock);
            expect(mockStatus).toHaveBeenCalledWith(404);
            expect(mockJson).toHaveBeenCalledWith(expect.objectContaining({
                error: 'Usuário não existe'
            }));
        }));
        it("não deve permitir login com senha incorreta", () => __awaiter(void 0, void 0, void 0, function* () {
            const usuarioMock = {
                id: 1,
                email: 'pedrinho@teste.com',
                senha: 'Senha@123',
                validaSenha: jest.fn().mockResolvedValue(false),
            };
            UsuarioModel_1.default.findOne.mockResolvedValue(usuarioMock);
            requisicaoMock.body = { email: 'pedrinho@teste.com', senha: 'SenhaErrada' };
            yield (0, loginController_1.loginUsuario)(requisicaoMock, respostaMock);
            expect(mockStatus).toHaveBeenCalledWith(400);
            expect(mockJson).toHaveBeenCalledWith(expect.objectContaining({
                error: 'Email ou Senha inválidos'
            }));
        }));
    });
});
