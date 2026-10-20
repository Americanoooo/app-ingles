import { QuizData, Pergunta, DadosQuiz, PerguntaBanco, PerguntaQuiz, AtualizarPergunta } from "@/types";
import { prisma } from "@/lib/prisma";

export async function criarQuiz(quizData: QuizData, perguntas: Pergunta[]): Promise <DadosQuiz> { 
    const perguntasParaSalvar = perguntas.map((p)=> ({
        enunciado: p.enunciado,
        categoria: p.categoria,
        opcoes: JSON.stringify(p.opcoes),
        resposta_certa: p.respostaCerta
    }))

    // @db.Date grava a parte de data em UTC. Com new Date() puro, um quiz feito depois das 21h
    // no Brasil ficaria com a data de amanhã. Calculando o dia em São Paulo, a data fica certa
    // independente do fuso do servidor.
    const hoje = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Sao_Paulo" }).format(new Date())

    const quiz = await prisma.quiz.create({
        data: {
            usuario_id:quizData.usuarioId,
            pergunta: { create: perguntasParaSalvar},
            dificuldade: quizData.dificuldade,
            total_perguntas: perguntasParaSalvar.length,
            data: new Date(hoje)

            
        },
        include: {pergunta: { orderBy: {id: "asc"} } },
    })
 
        return {
            quizId: quiz.id,
            todasPerguntas:quiz.pergunta.map((p)=>({
                id:p.id,
                enunciado: p.enunciado,
                categoria: p.categoria,
                opcoes: JSON.parse(p.opcoes),

            }))
        }
}