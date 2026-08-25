"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export function AuthGuard({children}: {children: React.ReactNode}){
    const router = useRouter()
    const [ok, setOk]= useState(false);

    useEffect(()=> {
        const token = localStorage.getItem('token')
        if(!token){
            router.push('/login')
        }else{
            setOk(true)
        }
    }, []);

    if(!ok) return null
    return <>{children}</>

}