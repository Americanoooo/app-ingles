import { cn } from "@/lib/utils";
import { caminhoBalao } from "./Logo";

const pontos = [
  { cx: 20, atraso: "0ms" },
  { cx: 32, atraso: "150ms" },
  { cx: 44, atraso: "300ms" },
];

/**
 * Balão de fala do ícone do app com três pontos "digitando", para os
 * momentos em que a IA está escrevendo (gerar quiz, gerar explicação).
 * É decorativo: quem usa o componente coloca o texto de status ao lado.
 */
export function BalaoDigitando({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      aria-hidden="true"
      className={cn("size-16 shrink-0", className)}
    >
      <path className="fill-primary" d={caminhoBalao} />
      {pontos.map(({ cx, atraso }) => (
        <circle
          key={cx}
          cx={cx}
          cy={27}
          r={4.5}
          style={{ animationDelay: atraso }}
          className="animate-digitando fill-primary-foreground [transform-box:fill-box] motion-reduce:animate-none"
        />
      ))}
    </svg>
  );
}
