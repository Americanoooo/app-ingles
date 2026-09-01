"use client";

import { apiFetch } from "@/lib/apiFetch";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {  buttonVariants } from "@/components/ui/button";



   interface Quiz{
     enunciado:string, 
        categoria: string,
        opcoes:string[],
        resposta_certa:string,
        resposta_usuario: string
    }

function QuizUnico(){
    const params = useParams()
    const id = params.id

    const [quiz, setQuiz]=useState<Quiz[]>([])
    const [carregando, setCarregando]=useState(true)

  async  function buscarQuizUnico(){
    try{
        const data = await apiFetch(`/api/relatorio/${id}`)
        setQuiz(data.quizzes)
         }catch(err){
            console.error(err)
         }finally{
            setCarregando(false)
         }
    }

    useEffect(()=> {
        buscarQuizUnico()
    },[id])


    return (
        <div className="min-h-screen bg-slate-200 flex flex-col items-center justify-center">
            <Card className="w-full max-w-3xl">
            <CardContent className="flex flex-col gap-10 justify-start min-h-100 max-h-150 overflow-y-auto">
            {carregando ===true ?(
                <h1 className="text-center text-xl ">Carregando...</h1>
            ): (


                        <>
                        {quiz.map((p, indexPergunta)=> (
                            <div key={indexPergunta} className="border border-slate-200 rounded-lg p-4 flex flex-col gap-3">
                            <p className="text-xl font-medium">{indexPergunta + 1}.{p.enunciado}</p>
                            <p className="text-lg font-medium capitalize">Categoria: {p.categoria.replace(/_/g, " ")}</p>

                            <div className={`flex flex-col border rounded-lg p-4 text-lg ${
                                p.resposta_certa === p.resposta_usuario
                                ? "border-green-500 bg-green-50"
                                : "border-red-500 bg-red-50"
                                }`}>
                                <p>Resposta correta: {p.resposta_certa}</p>
                                <p>Resposta do usuário: {p.resposta_usuario}</p>
                                </div>


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