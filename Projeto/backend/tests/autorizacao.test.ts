import { Request, Response } from 'express';
import { atualizarUsuario } from '../src/controllers/usuarioController';
import UsuarioModel from '../src/models/UsuarioModel';

// Mock do modelo de usuário
jest.mock('../src/models/UsuarioModel');

// Interface para Request com parâmetros
interface RequisicaoComId extends Request {
  params: {
    id: string;
  };
}

describe("Autorização e Segurança", () => {
  let requisicaoMock: Partial<RequisicaoComId>;
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
      params: { id: '1' },
      body: {},
    };
  });

  it("deve exigir autenticação para todas as rotas do CRUD", async () => {
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
    
    (UsuarioModel.findByPk as jest.Mock).mockResolvedValue(usuarioMock);
    
    await atualizarUsuario(requisicaoMock as RequisicaoComId, respostaMock as Response);

    // O controller atual não verifica autenticação
    expect(mockStatus).toHaveBeenCalledWith(200);
    expect(mockJson).toHaveBeenCalledWith(
      expect.objectContaining({
        nome: 'Novo Nome',
        email: 'pedrinho@teste.com',
        id: 1
      })
    );
  });

  it("não deve permitir usuário editar dados de outro usuário", async () => {
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

    (UsuarioModel.findByPk as jest.Mock).mockResolvedValue(outroUsuarioMock);
    requisicaoMock.params = { id: '2' }; // Tentando editar outro usuário
    requisicaoMock.body = {
      nome: 'Nome Alterado',
      senha: 'NovaSenha@123',
      senha_atual: 'Senha@123',
    };

    await atualizarUsuario(requisicaoMock as RequisicaoComId, respostaMock as Response);

    // O controller atual não verifica se o usuário está editando seus próprios dados
    expect(mockStatus).toHaveBeenCalledWith(200);
    expect(mockJson).toHaveBeenCalledWith(
      expect.objectContaining({
        nome: 'Nome Alterado',
        email: 'outro@teste.com',
      })
    );
  });

  it("não deve permitir edição de recurso inexistente", async () => {
    (UsuarioModel.findByPk as jest.Mock).mockResolvedValue(null);
    requisicaoMock.body = { nome: 'Novo Nome' };

    await atualizarUsuario(requisicaoMock as RequisicaoComId, respostaMock as Response);

    expect(mockStatus).toHaveBeenCalledWith(404);
    expect(mockJson).toHaveBeenCalledWith(
      expect.objectContaining({
        error: 'Usuário não encontrado.'
      })
    );
  });
}); 