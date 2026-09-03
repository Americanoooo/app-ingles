"use client";

import { apiFetch } from "@/lib/apiFetch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
    const [filtroDificuldade, setFiltroDificuldade]=useState('Todas')
    const [filtroPeriodo, setFiltroPeriodo] = useState("Todas");



    const quizzesFiltrados = quiz.filter((q)=> {
        const passaDificuldade = 
        filtroDificuldade === "Todas" ? true : q.dificuldade === Number(filtroDificuldade)
        
        let passaPeriodo = true
        if(filtroPeriodo !== "Todas") {
            const diasAtras = (new Date().getTime() - new Date(q.data). getTime()) / (1000 * 60 * 60 * 24)
            if(filtroPeriodo === "7") passaPeriodo = diasAtras <=7
            if(filtroPeriodo ==="30") passaPeriodo = diasAtras <=30
      
        }
        return passaDificuldade && passaPeriodo
    })

    const dificuldades = [
        {label: "Todas as dificuldades", value: "Todas"},
        {label: "Fácil", value:"1"},
        {label: "Média", value: "2" },
        {label: "Difícil", value: "3" },
    ]

    const periodos = [
        {label: 'Qualquer periodo', value:'Todas'},
        {label: 'Últimos 7 dias', value:'7'},
        {label: 'Últimos 30 dias', value:'30'}
    ]

   

    async function buscarQuiz(){
        try{
            const data = await apiFetch('/api/relatorio',)
            setQuiz(data.quizzes)
        }catch{
        }finally{
            setCarregando(false)
        }
    }
    useEffect(()=>{
        buscarQuiz()
    }, [])

    function converterDificuldade(d: number){
        if(d ===1){
            return "Fácil"
        }else if(d===2){
            return "Média"
        }else if(d===3){
            return "Difícil"
        }
    }


    return(
        <>
        <div className="min-h-screen bg-slate-200 flex items-center justify-center">
        <Card className="w-full max-w-3xl">
        <CardHeader>
        <CardTitle className="text-2xl text-center">Relatório</CardTitle>
        <div className="flex justify-center gap-5">
        <Select items={dificuldades} value={filtroDificuldade} onValueChange={(value)=> setFiltroDificuldade(value ?? "Todas")} >
            <SelectTrigger className="text-lg">
                <SelectValue placeholder="Dificuldade"/>
            </SelectTrigger>
                <SelectContent className="text-lg ">
                    {dificuldades.map((d)=> (
                        <SelectItem key={d.value} value={d.value}> {d.label}</SelectItem>
                    ))}
            </SelectContent>
        </Select>
        

          <Select items={periodos} value={filtroPeriodo} onValueChange={(value)=> setFiltroPeriodo(value ?? "Todas")} >
            <SelectTrigger className="text-lg">
                <SelectValue placeholder="Período"/>
            </SelectTrigger>
                <SelectContent className="text-lg ">
                    {periodos.map((d)=> (
                        <SelectItem key={d.value} value={d.value}> {d.label}</SelectItem>
                    ))}
            </SelectContent>
        </Select>

          </div>
        </CardHeader>

        <CardContent className="flex flex-col gap-5 items-center py-3">
        {carregando === false ?(

        
        <div className="overflow-y-auto max-h-[70vh] ">

            {quizzesFiltrados.length > 0 ?(
                < >
                <div className=" grid grid-cols-1 md:grid-cols-2 gap-5   ">
            {quizzesFiltrados.map((q)=> (

                <Link key={q.id} href={`relatorio/${q.id}`}>
                    <Card className="hover:shadow-md transition cursor-pointer">
                    <CardContent className="text-lg">
                        <div className="flex justify-between">
                            <p>Dificuldade: {converterDificuldade(q.dificuldade)}</p>                        
                    <p className="text-lg">{new Date(q.data).toLocaleDateString('pt-BR')}</p>
                    </div>
                    <h2>Quantidade de perguntas: {q.total_perguntas} - Acertos: {q.nota}</h2>
                    <h2>Nota: {q.nota / q.total_perguntas}</h2>
                    </CardContent>
                    </Card>
                </Link>

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
                <h2 className=" text-lg">Carregando...</h2>
                </div>
        )}

        </CardContent>

        </Card>
        </div>
        </>
    )
}
export default Relatorio