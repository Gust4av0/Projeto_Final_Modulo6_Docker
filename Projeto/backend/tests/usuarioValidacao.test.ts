import { validarCPF, validarEmail, validarSenhaForte } from "../src/utils/validacoes";

describe("Validação de CPF", () => {
  it("deve retornar true para CPF válido", () => {
    expect(validarCPF("529.982.247-25")).toBe(true);
    expect(validarCPF("11144477735")).toBe(true);
  });

  it("deve retornar false para CPF inválido", () => {
    expect(validarCPF("111.111.111-11")).toBe(false);
    expect(validarCPF("123.456.789-00")).toBe(false);
    expect(validarCPF("000.000.000-00")).toBe(false);
  });
});

describe("Validação de Email", () => {
  it("deve aceitar e-mails válidos", () => {
    expect(validarEmail("usuario@dominio.com")).toBe(true);
    expect(validarEmail("usuario.nome@dominio.com.br")).toBe(true);
  });

  it("deve rejeitar e-mails inválidos", () => {
    expect(validarEmail("usuario@")).toBe(false);
    expect(validarEmail("@dominio.com")).toBe(false);
    expect(validarEmail("usuario@dominio")).toBe(false);
  });
});

describe("Validação de Senha Forte", () => {
  it("deve aceitar senhas fortes", () => {
    expect(validarSenhaForte("Senha@123")).toBe(true);
    expect(validarSenhaForte("P@ssw0rd")).toBe(true);
  });

  it("deve rejeitar senhas fracas", () => {
    expect(validarSenhaForte("senha")).toBe(false);
    expect(validarSenhaForte("123456")).toBe(false);
    expect(validarSenhaForte("abcdef")).toBe(false);
  });
});
