"use client"

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { apiFetch } from "@/lib/apiFetch";
import {  Pergunta } from "@/types";
import { useState } from "react";
import { Lightbulb, Loader2 } from "lucide-react";
import { BalaoDigitando } from "./BalaoDigitando";



    interface FeedbackProps{
        pergunta: Pergunta
    }


export function FeedbackButton({pergunta}: FeedbackProps){
    const [aberto, setAberto]= useState(false)
    const [carregando, setCarregando]=useState(false)
    const [erro,setErro]=useState('')
    const [explicacao, setExplicacao]=useState('')

    async function handleFeedback(){
        setAberto(true)
        setErro('')
        if(explicacao) return;
        setCarregando(true)
      

        try{
            const data = await apiFetch('/api/feedback',{
                method:"POST",
                body: JSON.stringify({
                    enunciado: pergunta.enunciado,
                    respostaCerta: pergunta.respostaCerta,
                    respostaUsuario:pergunta.respostaUsuario,
                    categoria: pergunta.categoria
                }),
            });
            setExplicacao(data.explicacao)
        }catch(err){
            console.error(err)
                setErro("Não foi possível gerar a explicação. Tente novamente.");
        }finally{
            setCarregando(false)
        }
    }
    return(
        <>
        <div className="flex justify-center sm:justify-start">
        <Button variant="outline" size="sm" className="w-full gap-1.5 rounded-full sm:w-auto" onClick={handleFeedback} disabled={carregando}>
            {carregando ? <Loader2 className="size-4 animate-spin" /> : <Lightbulb className="size-4" />}
            {carregando ? "Gerando..." : "Ver explicação"}
        </Button>
        </div>
        <Dialog open={aberto} onOpenChange={setAberto}>
            <DialogContent>

          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg text-primary-strong">
                <Lightbulb className="size-5" />
                Explicação
            </DialogTitle>
            </DialogHeader>

          {carregando ? (
            <div role="status" className="flex flex-col items-center gap-2 py-4 text-center">
                <BalaoDigitando className="size-12" />
                <p className="text-sm text-muted-foreground">Gerando explicação...</p>
            </div>
          ) : erro ? (
            <p role="alert" className="text-sm font-semibold text-destructive-strong">{erro}</p>
          ) : (
            <p className="text-base leading-7 text-foreground">{explicacao}</p>
          )}
        </DialogContent>

        </Dialog>
        </>
    )


}