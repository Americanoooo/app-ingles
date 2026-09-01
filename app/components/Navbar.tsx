"use client"

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/apiFetch";

export function Navbar(){
    const router = useRouter()

    async function handleLogout(){
      await apiFetch("api/logout", {method:"POST"})
    }

    return(
    <nav className="flex justify-between items-center h-16 px-8 bg-slate-900 text-white shadow-md">
      <h1 className="text-xl font-bold">App Inglês</h1>

      <div className="flex gap-8 items-center">
        <Link href="/treino" className="hover:text-slate-300 transition">Início</Link>
        <Link href="/relatorio" className="hover:text-slate-300 transition">Relatório</Link>
        <Button
          onClick={() => { handleLogout(); router.push('/login'); }}
          variant="destructive"
        >
          Sair
        </Button>
      </div>
    </nav>
    )
}