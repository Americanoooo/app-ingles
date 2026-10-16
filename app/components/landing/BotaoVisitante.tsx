"use client";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const ERRO_PADRAO =
  "Não foi possível entrar como visitante. Tente de novo ou crie uma conta.";

/**
 * Contrato esperado do back-end: POST /api/visitante cria a sessão (cookie
 * "session") e responde 2xx; em caso de erro responde { mensagem }.
 * Usa fetch direto em vez de apiFetch porque o apiFetch redireciona para
 * /login em qualquer 401.
 */
export function BotaoVisitante() {
  const router = useRouter();
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  async function entrarComoVisitante() {
    setErro("");
    setCarregando(true);
    try {
      const res = await fetch("/api/visitante", {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) {
        let mensagem = ERRO_PADRAO;
        // 401 e 404 aqui significam que a rota ainda não está disponível.
        if (res.status !== 401 && res.status !== 404) {
          try {
            const data = await res.json();
            if (data?.mensagem) mensagem = data.mensagem;
          } catch {}
        }
        setErro(mensagem);
        setCarregando(false);
        return;
      }

      router.push("/treino");
    } catch {
      setErro(ERRO_PADRAO);
      setCarregando(false);
    }
  }

  return (
    <div className="flex flex-col gap-1.5">
      <Button
        variant="ghost"
        size="lg"
        className="w-full rounded-full"
        onClick={entrarComoVisitante}
        disabled={carregando}
      >
        {carregando && <Loader2 className="animate-spin" />}
        {carregando ? "Entrando..." : "Entrar como visitante"}
      </Button>
      <p className="text-center text-xs text-muted-foreground">
        Teste sem cadastro. Seu histórico não fica salvo.
      </p>
      <p aria-live="polite" className="text-center text-sm font-medium text-destructive empty:hidden">
        {erro}
      </p>
    </div>
  );
}
