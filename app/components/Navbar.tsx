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
    <nav className="bg-slate-900 text-white shadow-md">
      <div className="flex justify-between items-center h-16 px-4 sm:px-8">
        <h1 className="text-lg sm:text-xl font-bold">App Inglês</h1>

        <div className="hidden sm:flex gap-8 items-center">
          <Link href="/treino" className="hover:text-slate-300 transition">Início</Link>
          <Link href="/relatorio" className="hover:text-slate-300 transition">Relatório</Link>
          <Button
            onClick={() => handleLogout()}
            variant="destructive"
          >
            Sair
          </Button>
        </div>

        <button
          type="button"
          className="sm:hidden inline-flex size-11 -mr-2 items-center justify-center rounded-lg hover:bg-white/10"
          aria-label={menuAberto ? "Fechar menu" : "Abrir menu"}
          aria-expanded={menuAberto}
          onClick={() => setMenuAberto((aberto) => !aberto)}
        >
          {menuAberto ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      {menuAberto && (
        <div className="sm:hidden flex flex-col gap-1 border-t border-white/10 px-4 pb-4">
          <Link
            href="/treino"
            className="py-3 hover:text-slate-300 transition"
            onClick={() => setMenuAberto(false)}
          >
            Início
          </Link>
          <Link
            href="/relatorio"
            className="py-3 hover:text-slate-300 transition"
            onClick={() => setMenuAberto(false)}
          >
            Relatório
          </Link>
          <Button
            onClick={() => handleLogout()}
            variant="destructive"
            className="mt-2 h-11 w-full"
          >
            Sair
          </Button>
        </div>
      )}
    </nav>
    )
}