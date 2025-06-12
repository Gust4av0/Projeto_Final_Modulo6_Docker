"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validacoes_1 = require("../src/utils/validacoes");
describe("Validação de CPF", () => {
    it("deve retornar true para CPF válido", () => {
        expect((0, validacoes_1.validarCPF)("529.982.247-25")).toBe(true);
        expect((0, validacoes_1.validarCPF)("11144477735")).toBe(true);
    });
    it("deve retornar false para CPF inválido", () => {
        expect((0, validacoes_1.validarCPF)("111.111.111-11")).toBe(false);
        expect((0, validacoes_1.validarCPF)("123.456.789-00")).toBe(false);
        expect((0, validacoes_1.validarCPF)("000.000.000-00")).toBe(false);
    });
});
describe("Validação de Email", () => {
    it("deve aceitar e-mails válidos", () => {
        expect((0, validacoes_1.validarEmail)("usuario@dominio.com")).toBe(true);
        expect((0, validacoes_1.validarEmail)("usuario.nome@dominio.com.br")).toBe(true);
    });
    it("deve rejeitar e-mails inválidos", () => {
        expect((0, validacoes_1.validarEmail)("usuario@")).toBe(false);
        expect((0, validacoes_1.validarEmail)("@dominio.com")).toBe(false);
        expect((0, validacoes_1.validarEmail)("usuario@dominio")).toBe(false);
    });
});
describe("Validação de Senha Forte", () => {
    it("deve aceitar senhas fortes", () => {
        expect((0, validacoes_1.validarSenhaForte)("Senha@123")).toBe(true);
        expect((0, validacoes_1.validarSenhaForte)("P@ssw0rd")).toBe(true);
    });
    it("deve rejeitar senhas fracas", () => {
        expect((0, validacoes_1.validarSenhaForte)("senha")).toBe(false);
        expect((0, validacoes_1.validarSenhaForte)("123456")).toBe(false);
        expect((0, validacoes_1.validarSenhaForte)("abcdef")).toBe(false);
    });
});
