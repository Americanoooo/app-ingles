"use client"

import Link from "next/link";
import { useRouter } from "next/navigation";

export function Navbar(){
    const router = useRouter()
    
    return(
    <nav className="flex justify-between items-center h-16 px-8 bg-blue-600 text-white shadow-md">
      <h1 className="text-xl font-bold">App Inglês</h1>

      <div className="flex gap-8 items-center">
        <Link href="/treino" className="hover:text-blue-200 transition">Início</Link>
        <Link href="/relatorio" className="hover:text-blue-200 transition">Relatório</Link>
        <button
          onClick={() => { localStorage.removeItem("token"); router.push('/login'); }}
          className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition cursor-pointer"
        >
          Sair
        </button>
      </div>
    </nav>  
    )
}