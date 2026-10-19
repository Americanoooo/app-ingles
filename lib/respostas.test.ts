import { describe, expect, it } from "vitest";
import { badRequest, calcularNota, NotFound, unauthorized } from "./respostas";

describe("calcularNota", () => {
  it("dá 10 quando acerta todas", () => {
    expect(calcularNota(5, 5)).toBe(10);
  });

  it("dá 0 quando erra todas", () => {
    expect(calcularNota(0, 10)).toBe(0);
  });

  it("dá 5 quando acerta metade", () => {
    expect(calcularNota(3, 6)).toBe(5);
  });

  it("arredonda para 2 casas decimais", () => {
    expect(calcularNota(3, 7)).toBe(4.29);
  });
});

describe("badRequest", () => {
  it("devolve 400 com a mensagem de dados inválidos", async () => {
    const resposta = badRequest();
    expect(resposta.status).toBe(400);

    const body = await resposta.json();
    expect(body).toEqual({ mensagem: "Dados inválidos. Tente novamente" });
  });
});

describe("unauthorized", () => {
  it("devolve 401 com a mensagem de não autorizado", async () => {
    const resposta = unauthorized();
    expect(resposta.status).toBe(401);

    const body = await resposta.json();
    expect(body).toEqual({ mensagem: "Não autorizado" });
  });
});

describe("NotFound", () => {
  it("devolve 404 com a mensagem de não encontrado", async () => {
    const resposta = NotFound();
    expect(resposta.status).toBe(404);

    const body = await resposta.json();
    expect(body).toEqual({ mensagem: "Não encontrado." });
  });
});
