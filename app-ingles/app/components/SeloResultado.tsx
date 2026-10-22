import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

type SeloResultadoProps = {
  acertou: boolean;
  /** Entra com a mesma animação da prévia da landing. */
  animado?: boolean;
  /** Atraso da animação em ms, para revelar os selos em sequência. */
  atraso?: number;
  className?: string;
};

/**
 * Marca acerto/erro com ícone e texto, não só com cor.
 */
export function SeloResultado({
  acertou,
  animado = false,
  atraso = 0,
  className,
}: SeloResultadoProps) {
  const Icone = acertou ? Check : X;
  return (
    <span
      style={animado ? { animationDelay: `${atraso}ms` } : undefined}
      className={cn(
        "inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold",
        acertou
          ? "bg-success/15 text-success-strong"
          : "bg-destructive/15 text-destructive-strong",
        animado && "animate-selo motion-reduce:animate-none",
        className
      )}
    >
      <Icone className="size-3.5" strokeWidth={3} aria-hidden="true" />
      {acertou ? "Acertou" : "Errou"}
    </span>
  );
}
