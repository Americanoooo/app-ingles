"use client"

import { apiFetch } from "@/lib/apiFetch";
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export function AuthGuard({children}: {children: React.ReactNode}){
    const router = useRouter()
    const [ok, setOk]= useState(false);

    useEffect(()=> {
        async function verificar(){
        try{
            await apiFetch("api/me")
            setOk(true)
        }catch{
            router.push('/login')
        }
        }
        verificar()
    }, []);

    if(!ok) return null
    return <>{children}</>

}