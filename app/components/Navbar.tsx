"use client"

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/apiFetch";
import { Menu, X } from "lucide-react";

export function Navbar(){
    const router = useRouter()
    const [menuAberto, setMenuAberto] = useState(false)

    async function handleLogout(){
      await apiFetch("/api/logout", {method:"POST"})
      window.location.href = "/login";
    }

    return(
    <nav className="border-b border-border bg-card">
      <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-4 sm:px-8">
        <h1 className="font-heading text-lg font-bold text-foreground sm:text-xl">
          App <span className="text-primary">Inglês</span>
        </h1>

        <div className="hidden sm:flex gap-2 items-center">
          <Link
            href="/treino"
            className="rounded-full px-4 py-2 text-sm font-semibold text-foreground outline-none select-none transition-[transform,opacity] duration-150 ease-out hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 active:translate-y-px"
          >
            Início
          </Link>
          <Link
            href="/relatorio"
            className="rounded-full px-4 py-2 text-sm font-semibold text-foreground outline-none select-none transition-[transform,opacity] duration-150 ease-out hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 active:translate-y-px"
          >
            Relatório
          </Link>
          <Button
            onClick={() => handleLogout()}
            variant="outline"
            size="sm"
            className="ml-2 rounded-full"
          >
            Sair
          </Button>
        </div>

        <button
          type="button"
          className="sm:hidden inline-flex size-11 -mr-2 items-center justify-center rounded-full text-foreground outline-none transition-[transform,opacity] duration-150 ease-out hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 active:translate-y-px"
          aria-label={menuAberto ? "Fechar menu" : "Abrir menu"}
          aria-expanded={menuAberto}
          onClick={() => setMenuAberto((aberto) => !aberto)}
        >
          {menuAberto ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      {menuAberto && (
        <div className="mx-auto sm:hidden flex max-w-3xl flex-col gap-1 border-t border-border px-4 pb-4">
          <Link
            href="/treino"
            className="rounded-xl px-3 py-3 text-base font-semibold text-foreground outline-none select-none transition-[transform,opacity] duration-150 ease-out hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 active:translate-y-px"
            onClick={() => setMenuAberto(false)}
          >
            Início
          </Link>
          <Link
            href="/relatorio"
            className="rounded-xl px-3 py-3 text-base font-semibold text-foreground outline-none select-none transition-[transform,opacity] duration-150 ease-out hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 active:translate-y-px"
            onClick={() => setMenuAberto(false)}
          >
            Relatório
          </Link>
          <Button
            onClick={() => handleLogout()}
            variant="outline"
            className="mt-2 h-11 w-full rounded-full"
          >
            Sair
          </Button>
        </div>
      )}
    </nav>
    )
}