"use client";

import { apiFetch } from "@/lib/apiFetch";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

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
        <div   className="min-h-screen bg-slate-200 flex flex-col items-center justify-center">
            <div className= "flex flex-col gap-10 bg-white h-150 w-1/2 rounded shadow p-3 justify-start">
            {carregando ===true ?(
                <h1 className="text-center font-semibold">Carregando...</h1>
            ): (

            
                          <div className= "flex flex-col gap-10 bg-white h-150  rounded shadow p-3 justify-start overflow-y-auto">
                        {quiz.map((p, indexPergunta)=> (
                            <div key={indexPergunta} className="border border-slate-200 rounded-lg p-4 flex flex-col gap-3"> 
                            <p className="text-lg font-medium">{indexPergunta + 1}.{p.enunciado}</p>
                            <div className={`flex flex-col border rounded-lg p-4 ${
                                p.resposta_certa === p.resposta_usuario
                                ? "border-green-500 bg-green-50"
                                : "border-red-500 bg-red-50"
                                }`}>
                                <p>Resposta correta: {p.resposta_certa}</p>
                                <p>Resposta do usuário: {p.resposta_usuario}</p>
                                </div>
                                   
                                
                            </div>
                        ))}
                        </div>
                        )}
            
            </div>
            <Link href='/relatorio'className="bg-gray-400 text-white p-2 rounded cursor-pointer " >
            Voltar</Link>
        </div>
    )
}
export default QuizUnico