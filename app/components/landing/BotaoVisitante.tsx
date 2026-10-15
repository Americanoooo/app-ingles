"use client";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/apiFetch";

const ERRO_PADRAO =
  "Não foi possível entrar como visitante. Tente de novo ou crie uma conta.";

export function BotaoVisitante() {
  const router = useRouter();
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  async function entrarComoVisitante() {
    setErro("");
    setCarregando(true);
    try {
      await apiFetch("/api/visitante", { method: "POST" });
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
        className="w-full cursor-pointer rounded-full"
        onClick={entrarComoVisitante}
        disabled={carregando}
      >
        {carregando && <Loader2 className="animate-spin" />}
        {carregando ? "Entrando..." : "Entrar como visitante"}
      </Button>
      <p className="text-center text-xs text-muted-foreground">
        Teste sem cadastro. Seu histórico não fica salvo.
      </p>
      <p aria-live="polite" className="text-center text-sm font-semibold text-destructive-strong empty:hidden">
        {erro}
      </p>
    </div>
  );
}
