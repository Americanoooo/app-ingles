"use client"

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { apiFetch } from "@/lib/apiFetch";
import { useState } from "react";

interface Pergunta{
     enunciado:string, 
        categoria: string,
        resposta_certa:string,
        resposta_usuario: string
    }

    interface FeedbackProps{
        pergunta: Pergunta
    }


export function FeedbackButton({pergunta}: FeedbackProps){
    const [aberto, setAberto]= useState(false)
    const [carregando, setCarregando]=useState(true)
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
                    resposta_certa: pergunta.resposta_certa,
                    resposta_usuario:pergunta.resposta_usuario,
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
        <div className="flex justify-center"> 
        <Button className="w-1/3 justify" onClick={handleFeedback}>Feedback</Button>
        </div>
        <Dialog open={aberto} onOpenChange={setAberto}>
            <DialogContent className="text-xl">

          <DialogHeader>
            <DialogTitle className="text-xl text-center">Explicação</DialogTitle>
            </DialogHeader>

          {carregando ? (
            <p>Gerando explicação...</p>
          ) : erro ? (
            <p className="text-red-500">{erro}</p>
          ) : (
            <p>{explicacao}</p>
          )}
        </DialogContent>      

        </Dialog>
        </>
    )
    

}