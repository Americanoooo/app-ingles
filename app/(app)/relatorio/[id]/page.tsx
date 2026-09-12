"use client";

import { apiFetch } from "@/lib/apiFetch";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {  buttonVariants } from "@/components/ui/button";
import {FeedbackButton} from "@/app/components/FeedbackButton"
import { Pergunta } from "@/types";



function QuizUnico(){
    const params = useParams()
    const id = params.id

    const [quiz, setQuiz]=useState<Pergunta[]>([])
    const [carregando, setCarregando]=useState(true)
    const [erro, setErro]=useState('')



  async  function buscarQuizUnico(){
    try{
        const data = await apiFetch(`/api/relatorio/${id}`)
        setQuiz(data.listaPerguntas)
        
         }catch(error){
            setErro(error instanceof Error ? error.message : 'Não foi possível exibir o quiz')
         }finally{
            setCarregando(false)
         }
    }

   

    useEffect(()=> {
        buscarQuizUnico()
    },[id])


    return (
        <div className="min-h-screen bg-slate-200 flex flex-col items-center justify-center gap-4 p-4">
            <Card className="w-full max-w-3xl">
            <CardContent className="flex flex-col gap-10 justify-start min-h-100 max-h-150 overflow-y-auto">
            {carregando ===true ?(
                <h1 className="text-center text-xl ">Carregando...</h1>
            ): (


                        <>
                        {erro && <h1 className="text-center text-xl ">{erro}</h1>}
                        {quiz.map((p, indexPergunta)=> (
                            <div key={indexPergunta} className="border border-slate-200 rounded-lg p-4 flex flex-col gap-3">
                            <p className="text-xl font-medium">{indexPergunta + 1}.{p.enunciado}</p>
                            <p className="text-lg font-medium capitalize">Categoria: {p.categoria.replace(/_/g, " ")}</p>

                            <div className={`flex flex-col border rounded-lg p-4 text-lg ${
                                p.respostaCerta === p.respostaUsuario
                                ? "border-green-500 bg-green-50"
                                : "border-red-500 bg-red-50"
                                }`}>
                                <p>Resposta correta: {p.respostaCerta}</p>
                                <p>Resposta do usuário: {p.respostaUsuario}</p>
                                </div>

                               <FeedbackButton pergunta={p}/>

                            </div>
                            
                        ))}
                           
                        </>
                
                        )}

            </CardContent>
            </Card>
           <Link href="/relatorio" className={buttonVariants({ variant: "outline" })}>
                    Voltar
            </Link>
        </div>
    )
}
export default QuizUnico