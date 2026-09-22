"use client";

import { apiFetch } from "@/lib/apiFetch";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {  buttonVariants } from "@/components/ui/button";
import {FeedbackButton} from "@/app/components/FeedbackButton"
import {  Pergunta } from "@/types";
import { ArrowLeft, Loader2, AlertCircle } from "lucide-react";



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
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <Card className="w-full max-w-2xl max-h-[85vh] flex flex-col gap-0 p-0 overflow-hidden">
                <CardHeader className="px-4 py-3 border-b border-border">
                    <div className="flex items-center gap-3">
                        <Link
                        href="/relatorio"
                        className={buttonVariants({ variant: "outline", size: "sm", className: "shrink-0 gap-1.5 rounded-full" })}
                        >
                            <ArrowLeft className="size-4" />
                            Voltar
                        </Link>
                        <CardTitle className="font-heading text-lg font-bold text-foreground">Detalhes do quiz</CardTitle>
                    </div>
                </CardHeader>

            <CardContent className="flex-1 overflow-y-auto flex flex-col gap-3 px-4 py-4">
            {carregando ===true ?(
                <div className="flex flex-col items-center gap-3 py-10 text-center">
                    <Loader2 className="size-8 animate-spin text-primary" />
                    <p className="font-heading text-lg font-semibold text-foreground">Carregando quiz...</p>
                </div>
            ): (


                        <>
                        {erro && (
                            <div className="flex flex-col items-center gap-3 py-10 text-center">
                                <AlertCircle className="size-8 text-destructive" />
                                <p className="font-heading text-lg font-semibold text-foreground">Não foi possível exibir o quiz</p>
                                <p className="text-sm text-muted-foreground">{erro}</p>
                            </div>
                        )}
                        {quiz.map((p, indexPergunta)=> (
                            <Card key={indexPergunta} className="shrink-0 gap-3 rounded-2xl">
                            <CardContent className="flex flex-col gap-3 py-4">
                            <div className="flex items-start gap-3">
                            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary font-heading text-sm font-bold text-primary-foreground">{indexPergunta + 1}</span>
                            <div className="flex flex-1 flex-col gap-1.5 pt-0.5">
                            <p className="text-base font-semibold text-foreground">{p.enunciado}</p>
                            <span className="w-fit rounded-full bg-muted px-2.5 py-1 text-xs font-bold capitalize text-muted-foreground">{p.categoria.replace(/_/g, " ")}</span>
                            </div>
                            </div>

                            <div className={`flex flex-col gap-1 rounded-xl border-2 p-3 text-sm ${
                                p.acertou === true
                                ? "border-success bg-success/10"
                                : "border-destructive bg-destructive/10"
                                }`}>
                                <p className="text-foreground"><span className="font-semibold text-muted-foreground">Sua resposta: </span>{p.respostaUsuario}</p>
                                <p className="font-semibold text-foreground"><span className="font-semibold text-muted-foreground">Resposta certa: </span>{p.respostaCerta}</p>
                                </div>

                               <FeedbackButton pergunta={p}/>

                            </CardContent>
                            </Card>
                        ))}

                        </>

                        )}

            </CardContent>
            </Card>
        </div>
    )
}
export default QuizUnico
