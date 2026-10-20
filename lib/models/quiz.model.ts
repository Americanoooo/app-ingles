import { QuizData, Pergunta, DadosQuiz, PerguntaBanco, PerguntaQuiz, AtualizarPergunta } from "@/types";
import { prisma } from "@/lib/prisma";

export async function criarQuiz(quizData: QuizData, perguntas: Pergunta[]): Promise <DadosQuiz> { 
    const perguntasParaSalvar = perguntas.map((p)=> ({
        enunciado: p.enunciado,
        categoria: p.categoria,
        opcoes: JSON.stringify(p.opcoes),
        resposta_certa: p.respostaCerta
    }))
    
    const quiz = await prisma.quiz.create({
        data: {
            usuario_id:quizData.usuarioId,
            pergunta: { create: perguntasParaSalvar},
            dificuldade: quizData.dificuldade,
            total_perguntas: perguntasParaSalvar.length,
            data: new Date()

            
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