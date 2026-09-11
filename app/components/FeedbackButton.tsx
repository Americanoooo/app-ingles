"use client"

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { apiFetch } from "@/lib/apiFetch";
import { Pergunta } from "@/types";
import { useState } from "react";



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
        <div className="flex justify-center">
        <Button className="w-full sm:w-auto sm:min-w-32" onClick={handleFeedback}>Feedback</Button>
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