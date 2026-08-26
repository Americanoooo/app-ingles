"use client";

import { apiFetch } from "@/lib/apiFetch";
import Link from "next/link";
import { useEffect, useState } from "react";

    interface Quiz{
        id: number,
        usuario_id: number,
        dificuldade: number,
        nota: number,
        data: string,
        total_perguntas: number
    }


function Relatorio(){
    const [quiz, setQuiz]=useState<Quiz[]>([])
    const [carregando, setCarregando]= useState(true)

    async function buscarQuiz(){
        try{
            const data = await apiFetch('/api/relatorio',)
            setQuiz(data.quizzes)
            console.log(data.quizzes)
        }catch(err){
            console.error(err)
        }finally{
            setCarregando(false)
        }
    }
    useEffect(()=>{
        buscarQuiz()
    }, [])


    return(
        <>
        <div className="min-h-screen bg-slate-200 flex items-center justify-center"> 
        <div className= "flex flex-col gap-5 bg-white h-120 w-1/2  rounded shadow p-3 items-center">
        <h2 className="text-xl">Relatório</h2>

        {carregando === false ?(

        
        <div className="overflow-y-auto max-h-[70vh]">
            {quiz.length > 0 ?(
                < >
                <div className="flex gap-5 flex-col ">
            {quiz.map((q)=> (
                                

                <div key={q.id} className="border border-slate-200 rounded-lg p-3 w-full">
                    <Link href={`relatorio/${q.id}`}>
                    <h2>Quantidade de perguntas: {q.total_perguntas} - Acertos: {q.nota}</h2>
                    <h2>Nota: {q.nota / q.total_perguntas}</h2>
                    <p>{new Date(q.data).toLocaleDateString('pt-BR')}</p>
                      </Link>
                    </div>
                  
            ))}
            
            </div>
            </>
            ): (
                <>
                <h2>
                    Nenhum quiz cadastrado
                    </h2>
                    </>

            )}
        </div>
        ): (
            <div>
                <h2 className=" font-semibold">Carregando...</h2>
                </div>
        )}

        </div>

        </div>
        </>
    )
}
export default Relatorio