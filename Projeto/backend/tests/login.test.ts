import { Request, Response } from 'express';
import { loginUsuario } from '../src/controllers/loginController';
import UsuarioModel from '../src/models/UsuarioModel';

// Mock do modelo de usuário
jest.mock('../src/models/UsuarioModel');

describe("Autenticação", () => {
  let requisicaoMock: Partial<Request>;
  let respostaMock: Partial<Response>;
  let mockJson: jest.Mock;
  let mockStatus: jest.Mock;

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
    it("deve permitir login com email e senha válidos", async () => {
      const usuarioMock = {
        id: 1,
        email: 'pedrinho@teste.com',
        senha: 'Senha@123',
        nome: 'Pedro Alex',
        validaSenha: jest.fn().mockResolvedValue(true),
      };

      (UsuarioModel.findOne as jest.Mock).mockResolvedValue(usuarioMock);
      requisicaoMock.body = { email: 'pedrinho@teste.com', senha: 'Senha@123' };

      await loginUsuario(requisicaoMock as Request, respostaMock as Response);

      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Bem-vindo ao sistema!',
          nome: 'Pedro Alex',
          id: 1,
        })
      );
    });

    it("não deve permitir login com email não cadastrado", async () => {
      (UsuarioModel.findOne as jest.Mock).mockResolvedValue(null);
      requisicaoMock.body = { email: 'naoexiste@teste.com', senha: 'Senha@123' };

      await loginUsuario(requisicaoMock as Request, respostaMock as Response);

      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          error: 'Usuário não existe'
        })
      );
    });

    it("não deve permitir login com senha incorreta", async () => {
      const usuarioMock = {
        id: 1,
        email: 'pedrinho@teste.com',
        senha: 'Senha@123',
        validaSenha: jest.fn().mockResolvedValue(false),
      };

      (UsuarioModel.findOne as jest.Mock).mockResolvedValue(usuarioMock);
      requisicaoMock.body = { email: 'pedrinho@teste.com', senha: 'SenhaErrada' };

      await loginUsuario(requisicaoMock as Request, respostaMock as Response);

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          error: 'Email ou Senha inválidos'
        })
      );
    });
  });
}); 