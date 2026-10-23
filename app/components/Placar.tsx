"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/** Duração da contagem do placar, em ms. Os selos do resultado começam depois dela. */
export const DURACAO_CONTAGEM = 700;

function prefereMenosMovimento() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/** Conta de 0 até `alvo`; com movimento reduzido, mostra o valor final direto. */
function useContagem(alvo: number) {
  const [valor, setValor] = useState(() =>
    prefereMenosMovimento() ? alvo : 0
  );

  useEffect(() => {
    if (prefereMenosMovimento()) return;
    let quadro = 0;
    const inicio = performance.now();
    function passo(agora: number) {
      const t = Math.min((agora - inicio) / DURACAO_CONTAGEM, 1);
      const suave = 1 - Math.pow(1 - t, 3);
      setValor(Math.round(alvo * suave));
      if (t < 1) quadro = requestAnimationFrame(passo);
    }
    quadro = requestAnimationFrame(passo);
    return () => cancelAnimationFrame(quadro);
  }, [alvo]);

  return valor;
}

function mensagem(acertos: number, total: number) {
  if (total > 0 && acertos === total) return "Mandou muito bem! 🎉";
  if (total > 0 && acertos >= total / 2) return "Bom trabalho!";
  return "Continue treinando!";
}

export function Placar({ acertos, total }: { acertos: number; total: number }) {
  const valor = useContagem(acertos);
  const terminou = valor === acertos;
  const gabaritou = total > 0 && acertos === total;

  return (
    <div className="flex flex-col items-center gap-1 text-center">
      <p className="sr-only">
        Você acertou {acertos} de {total}. {mensagem(acertos, total)}
      </p>
      <p
        aria-hidden="true"
        className={cn(
          "font-heading text-5xl font-bold text-primary-strong tabular-nums",
          terminou && gabaritou && "animate-placar-pulo motion-reduce:animate-none"
        )}
      >
        {valor}
        <span className="text-2xl text-muted-foreground">/{total}</span>
      </p>
      <p
        aria-hidden="true"
        className={cn(
          "text-base font-semibold text-foreground transition-opacity duration-300 motion-reduce:transition-none",
          terminou ? "opacity-100" : "opacity-0"
        )}
      >
        {mensagem(acertos, total)}
      </p>
    </div>
  );
}
