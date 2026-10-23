import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt =
  "AI Fluency: treine seu inglês com inteligência artificial. Exemplo de pergunta do quiz.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// O ImageResponse não enxerga as variáveis CSS do tema, então os valores
// abaixo espelham os tokens do modo claro em app/globals.css.
const cor = {
  background: "#FFF9F2",
  foreground: "#1F2430",
  card: "#FFFFFF",
  primary: "#FF7A1A",
  primaryActive: "#D65D06",
  primaryForeground: "#FFFFFF",
  mutedForeground: "#6B7280",
  border: "#E8E1D9",
};

// O gerador só lê ttf/otf/woff estáticos; as fontes do app são woff2 variáveis.
const pastaFontes = join(process.cwd(), "app/fonts/og");
const [fredokaBold, nunitoRegular, nunitoSemiBold] = await Promise.all([
  readFile(join(pastaFontes, "Fredoka-Bold.ttf")),
  readFile(join(pastaFontes, "Nunito-Regular.ttf")),
  readFile(join(pastaFontes, "Nunito-SemiBold.ttf")),
]);

const opcoes = [
  { texto: "go", certa: false },
  { texto: "went", certa: true },
  { texto: "goes", certa: false },
];

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 70px 0 80px",
          backgroundColor: cor.background,
          backgroundImage:
            "radial-gradient(circle at 85% 50%, rgba(255, 122, 26, 0.10), rgba(255, 122, 26, 0) 55%)",
          fontFamily: "Nunito",
          color: cor.foreground,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", width: 540 }}>
          <div
            style={{
              display: "flex",
              fontFamily: "Fredoka",
              fontSize: 34,
              marginBottom: 40,
            }}
          >
            <span style={{ color: cor.primary }}>AI</span>
            <span style={{ marginLeft: 10 }}>Fluency</span>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontFamily: "Fredoka",
              fontSize: 64,
              lineHeight: 1.12,
              letterSpacing: -0.5,
            }}
          >
            <span>Treine seu inglês</span>
            <span>com inteligência</span>
            <span style={{ color: cor.primary }}>artificial.</span>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 25,
              lineHeight: 1.4,
              color: cor.mutedForeground,
              marginTop: 32,
            }}
          >
            <span>Quiz e feedback gerados por IA,</span>
            <span>com correção feita no servidor.</span>
          </div>

          <div
            style={{
              display: "flex",
              fontSize: 19,
              color: cor.mutedForeground,
              opacity: 0.85,
              marginTop: 48,
            }}
          >
            Next.js · TypeScript · MySQL · Gemini
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: 470,
            padding: "40px 38px",
            backgroundColor: cor.card,
            border: `2px solid ${cor.border}`,
            borderRadius: 40,
            boxShadow: "0 24px 60px rgba(214, 93, 6, 0.10)",
          }}
        >
          <span
            style={{
              fontFamily: "Fredoka",
              fontSize: 18,
              color: cor.primary,
              letterSpacing: 0.5,
            }}
          >
            PERGUNTA 1 DE 5
          </span>
          <span
            style={{
              fontFamily: "Fredoka",
              fontSize: 26,
              lineHeight: 1.35,
              marginTop: 14,
              marginBottom: 26,
            }}
          >
            She ___ to the store yesterday.
          </span>

          {opcoes.map(({ texto, certa }) => (
            <div
              key={texto}
              style={{
                display: "flex",
                alignItems: "center",
                height: 56,
                padding: "0 28px",
                marginTop: 12,
                borderRadius: 28,
                fontFamily: "Nunito",
                fontWeight: 600,
                fontSize: 22,
                color: certa ? cor.primaryForeground : cor.foreground,
                backgroundColor: certa ? cor.primary : cor.background,
                border: `2px solid ${certa ? cor.primary : cor.border}`,
                borderBottom: `5px solid ${certa ? cor.primaryActive : cor.border}`,
              }}
            >
              {texto}
            </div>
          ))}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Fredoka", data: fredokaBold, style: "normal", weight: 700 },
        { name: "Nunito", data: nunitoRegular, style: "normal", weight: 400 },
        { name: "Nunito", data: nunitoSemiBold, style: "normal", weight: 600 },
      ],
    }
  );
}
