import { Request, Response } from 'express';
import { criarUsuario, atualizarUsuario, deletarUsuarioId } from '../src/controllers/usuarioController';
import UsuarioModel from '../src/models/UsuarioModel';

// Mock do modelo de usuário
jest.mock('../src/models/UsuarioModel');

// Interface para Request com parâmetros
interface RequisicaoComId extends Request {
  params: {
    id: string;
  };
}

describe("Cadastro de Usuário", () => {
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

  it("deve criar um novo usuário com dados válidos", async () => {
    const usuarioMock = {
      id: 1,
      nome: 'Pedro Alex',
      email: 'pedrinho@teste.com',
      cpf: '529.982.247-25',
      senha: 'Senha@123',
    };

    (UsuarioModel.create as jest.Mock).mockResolvedValue(usuarioMock);
    requisicaoMock.body = usuarioMock;

    await criarUsuario(requisicaoMock as Request, respostaMock as Response);

    expect(mockStatus).toHaveBeenCalledWith(201);
    expect(mockJson).toHaveBeenCalledWith(usuarioMock);
  });

  it("não deve criar usuário com CPF inválido", async () => {
    requisicaoMock.body = {
      nome: 'Pedro Alex',
      email: 'pedrinho@teste.com',
      cpf: '111.111.111-11',
      senha: 'Senha@123',
    };

    await criarUsuario(requisicaoMock as Request, respostaMock as Response);

    expect(mockStatus).toHaveBeenCalledWith(400);
    expect(mockJson).toHaveBeenCalledWith(
      expect.objectContaining({
        error: 'CPF inválido.'
      })
    );
  });
});

describe("Edição de Usuário", () => {
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

  it("deve permitir usuário editar seus próprios dados", async () => {
    const usuarioMock = {
      id: 1,
      nome: 'Pedro Alex',
      email: 'pedrinho@teste.com',
      cpf: '529.982.247-25',
      senha: 'Senha@123',
      save: jest.fn().mockResolvedValue(true),
      validaSenha: jest.fn().mockResolvedValue(true),
    };

    (UsuarioModel.findByPk as jest.Mock).mockResolvedValue(usuarioMock);
    requisicaoMock.body = {
      nome: 'Novo Nome',
      senha: 'NovaSenha@123',
      senha_atual: 'Senha@123',
    };

    await atualizarUsuario(requisicaoMock as RequisicaoComId, respostaMock as Response);

    expect(mockStatus).toHaveBeenCalledWith(200);
    expect(mockJson).toHaveBeenCalledWith(
      expect.objectContaining({
        nome: 'Novo Nome',
        email: 'pedrinho@teste.com',
      })
    );
  });

  it("não deve permitir alteração de email", async () => {
    const usuarioMock = {
      id: 1,
      nome: 'Pedro Alex',
      email: 'pedrinho@teste.com',
      cpf: '529.982.247-25',
      senha: 'Senha@123',
      save: jest.fn().mockResolvedValue(true),
    };

    (UsuarioModel.findByPk as jest.Mock).mockResolvedValue(usuarioMock);
    requisicaoMock.body = {
      email: 'novo@teste.com',
    };

    await atualizarUsuario(requisicaoMock as RequisicaoComId, respostaMock as Response);

    expect(mockJson).toHaveBeenCalledWith(
      expect.objectContaining({
        email: 'pedrinho@teste.com', // Email não deve ter mudado
      })
    );
  });

  it("deve validar todos os campos obrigatórios na edição", async () => {
    const usuarioMock = {
      id: 1,
      nome: 'Pedro Alex',
      email: 'pedrinho@teste.com',
      cpf: '529.982.247-25',
      senha: 'Senha@123',
      save: jest.fn().mockResolvedValue(true),
    };

    (UsuarioModel.findByPk as jest.Mock).mockResolvedValue(usuarioMock);
    requisicaoMock.body = {
      nome: '', // Nome vazio
      cpf: '', // CPF vazio
    };

    await atualizarUsuario(requisicaoMock as RequisicaoComId, respostaMock as Response);

    // O controller mantém os valores originais quando campos estão vazios
    expect(mockStatus).toHaveBeenCalledWith(200);
    expect(mockJson).toHaveBeenCalledWith(
      expect.objectContaining({
        nome: 'Pedro Alex',
        cpf: '529.982.247-25',
        email: 'pedrinho@teste.com',
        id: 1
      })
    );
  });
});

describe("Exclusão de Usuário", () => {
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
    };
  });

  it("não deve permitir exclusão de recurso inexistente", async () => {
    (UsuarioModel.findByPk as jest.Mock).mockResolvedValue(null);

    await deletarUsuarioId(requisicaoMock as RequisicaoComId, respostaMock as Response);

    expect(mockStatus).toHaveBeenCalledWith(404);
    expect(mockJson).toHaveBeenCalledWith(
      expect.objectContaining({
        error: 'Usuário não encontrado'
      })
    );
  });
}); 