import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    // faz o "@/lib/..." do tsconfig funcionar dentro dos testes
    tsconfigPaths: true,
  },
  test: {
    // os testes são de back-end (rotas e regras), não de tela
    environment: "node",
    include: ["**/*.test.ts"],
  },
});
