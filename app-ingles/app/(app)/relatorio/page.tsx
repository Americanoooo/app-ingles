"use client";

import { apiFetch } from "@/lib/apiFetch";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Quiz } from "@/types";
import { Loader2, AlertCircle, FileQuestion } from "lucide-react";




function Relatorio(){
    const [quiz, setQuiz]=useState<Quiz[]>([])
    const [carregando, setCarregando]= useState(true)
    const [filtroDificuldade, setFiltroDificuldade]=useState('Todas')
    const [filtroPeriodo, setFiltroPeriodo] = useState("Todas");
    const [erro, setErro]=useState('')



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
        }catch(error){
            setErro(error instanceof Error ? error.message : 'Não foi possível exibir o relatório.')
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

    function corDificuldade(d: number){
        if(d === 1) return "bg-success/15 text-success ring-1 ring-success/30"
        if(d === 2) return "bg-warning/15 text-warning ring-1 ring-warning/30"
        return "bg-destructive/15 text-destructive ring-1 ring-destructive/30"
    }


    return(
        <>
        <div className="min-h-screen bg-background p-4 sm:p-6">
        <div className="mx-auto flex max-w-3xl flex-col gap-6">

        <div className="flex flex-col gap-1">
            <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground">Relatório</h1>
            <p className="text-sm text-muted-foreground">Veja o histórico dos seus quizzes e acompanhe sua evolução.</p>
        </div>

        <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-3 sm:flex-row">
        <Select items={dificuldades} value={filtroDificuldade} onValueChange={(value)=> setFiltroDificuldade(value ?? "Todas")} >
            <SelectTrigger className="h-12 w-full rounded-2xl text-sm sm:w-56">
                <SelectValue placeholder="Dificuldade"/>
            </SelectTrigger>
                <SelectContent>
                    {dificuldades.map((d)=> (
                        <SelectItem key={d.value} value={d.value}> {d.label}</SelectItem>
                    ))}
            </SelectContent>
        </Select>


          <Select items={periodos} value={filtroPeriodo} onValueChange={(value)=> setFiltroPeriodo(value ?? "Todas")} >
            <SelectTrigger className="h-12 w-full rounded-2xl text-sm sm:w-56">
                <SelectValue placeholder="Período"/>
            </SelectTrigger>
                <SelectContent>
                    {periodos.map((d)=> (
                        <SelectItem key={d.value} value={d.value}> {d.label}</SelectItem>
                    ))}
            </SelectContent>
        </Select>

        </div>

        {carregando === false ?(

        <>
            {erro ? (
                <div className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-card px-6 py-16 text-center">
                    <AlertCircle className="size-10 text-destructive" />
                    <p className="font-heading text-lg font-semibold text-foreground">Não foi possível exibir o relatório</p>
                    <p className="text-sm text-muted-foreground">{erro}</p>
                </div>
            ) : quizzesFiltrados.length > 0 ?(
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {quizzesFiltrados.map((q)=> (

                <Link
                key={q.id}
                href={`relatorio/${q.id}`}
                className="group rounded-2xl outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                    <Card className="gap-0 rounded-2xl p-0 transition-transform duration-150 ease-out group-hover:-translate-y-1 group-active:translate-y-0">
                    <CardContent className="flex flex-col gap-4 p-4">
                        <div className="flex items-center justify-between gap-3">
                            <span className={`rounded-full px-2.5 py-1 text-sm font-bold ${corDificuldade(q.dificuldade)}`}>{converterDificuldade(q.dificuldade)}</span>
                            <span className="text-xs font-medium text-muted-foreground">{new Date(q.data).toLocaleDateString('pt-BR')}</span>
                        </div>
                        <div className="flex items-end justify-between gap-3">
                            <p className="font-heading text-4xl font-bold text-primary">Nota: {q.nota}</p>
                            <p className="text-xs font-medium text-muted-foreground">{q.totalPerguntas} perguntas</p>
                        </div>
                    </CardContent>
                    </Card>
                </Link>

            ))}

            </div>
            ): (
               !erro && (
                    <div className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-card px-6 py-16 text-center">
                        <FileQuestion className="size-10 text-muted-foreground" />
                        <p className="font-heading text-lg font-semibold text-foreground">Nenhum quiz encontrado</p>
                        <p className="text-sm text-muted-foreground">Treine um pouco e volte aqui para ver seu histórico.</p>
                    </div>
                )

            )}
        </>
        ): (
            <div className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-card px-6 py-16 text-center">
                <Loader2 className="size-8 animate-spin text-primary" />
                <p className="font-heading text-lg font-semibold text-foreground">Carregando relatório...</p>
            </div>
        )}

        </div>
        </div>
        </>
    )
}
export default Relatorio