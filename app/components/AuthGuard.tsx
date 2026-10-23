"use client"

import { useRouter } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import { Loader2, WifiOff } from "lucide-react"
import { Button } from "@/components/ui/button"

type Sessao = "ok" | "deslogado" | "erro"

// fetch direto em vez do apiFetch: o guard precisa separar 401 (deslogado)
// de falha de rede/servidor (não dá pra saber), e o apiFetch mistura os dois
async function checarSessao(): Promise<Sessao>{
    try{
        // Sem timeout, uma conexão que cai sem falhar deixa o fetch pendurado por minutos
        const res = await fetch("/api/me", { credentials: "include", signal: AbortSignal.timeout(10000) })
        if(res.status === 401) return "deslogado"
        if(!res.ok) throw new Error(`/api/me respondeu ${res.status}`)
        return "ok"
    }catch(err){
        console.error(err)
        return "erro"
    }
}

export function AuthGuard({children}: {children: React.ReactNode}){
    const router = useRouter()
    const [estado, setEstado]= useState<"verificando" | "ok" | "erro">("verificando");
    const [tentando, setTentando]= useState(false);

    const aplicar = useCallback((sessao: Sessao) => {
        // replace pra o botão voltar não cair de novo na página protegida
        if(sessao === "deslogado") return router.replace("/")
        setEstado(sessao)
    }, [router])

    const tentarDeNovo = useCallback(async () => {
        setTentando(true)
        aplicar(await checarSessao())
        setTentando(false)
    }, [aplicar])

    useEffect(()=> {
        let ativo = true
        checarSessao().then((sessao) => { if(ativo) aplicar(sessao) })
        return () => { ativo = false }
    }, [aplicar]);

    // Tenta de novo sozinho quando a internet volta
    useEffect(()=> {
        if(estado !== "erro") return
        window.addEventListener("online", tentarDeNovo)
        return () => window.removeEventListener("online", tentarDeNovo)
    }, [estado, tentarDeNovo]);

    if(estado === "verificando") return null

    if(estado === "erro"){
        return (
            <div role="alert" className="flex min-h-screen flex-col items-center justify-center gap-3 p-4 text-center">
                <WifiOff className="size-10 text-muted-foreground" aria-hidden="true" />
                <p className="font-heading text-lg font-semibold text-foreground">Não foi possível conectar</p>
                <p className="max-w-xs text-sm text-muted-foreground">Confira sua internet e tente de novo.</p>
                <Button size="lg" className="mt-2 rounded-full" onClick={tentarDeNovo} disabled={tentando}>
                    {tentando && <Loader2 className="animate-spin" />}
                    {tentando ? "Tentando..." : "Tentar de novo"}
                </Button>
            </div>
        )
    }

    return <>{children}</>

}
