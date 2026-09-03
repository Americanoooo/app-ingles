"use client";

import { apiFetch } from "@/lib/apiFetch";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    async function verificar(){
      try{
        await apiFetch('/api/me');
        router.replace('/treino')
     }catch{
      router.replace('/login')
     }
    }
    verificar()
  }, [router]);

  return null;
}
sim