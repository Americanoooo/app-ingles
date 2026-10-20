import { QuizData, Pergunta, DadosQuiz, AtualizarPergunta, PerguntaQuiz } from "@/types";
import { prisma } from "@/lib/prisma";
import { QuizNaoEncontradoError } from "@/lib/erros";



export async function criarQuiz(quizData: QuizData, perguntas: Pergunta[]): Promise <DadosQuiz> { 
    const perguntasParaSalvar = perguntas.map((p)=> ({
        enunciado: p.enunciado,
        categoria: p.categoria,
        opcoes: JSON.stringify(p.opcoes),
        resposta_certa: p.respostaCerta
    }))

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

export async function atualizarQuiz(quiz: AtualizarPergunta, usuarioId:number, notaCalculada:number): Promise <void>{
        return prisma.$transaction(async (tx)=> {
            const { count } = await tx.quiz.updateMany({
                where: {
                    id: quiz.id,
                    usuario_id: usuarioId,
                    nota: null
                },
                data: {
                    nota: notaCalculada
                }
            })

            if(count === 0){
                throw new QuizNaoEncontradoError("Não foi possível atualizar o quiz")
            }

            for(const pergunta of quiz.perguntas){
                await tx.pergunta.update({
                    where: {
                        id: pergunta.id,
                        quiz_id: quiz.id
                    },
                    data: {
                        resposta_usuario: pergunta.respostaUsuario,
                        acertou: pergunta.acertou,

                    }
                })
            }
        })
}

export async function buscarQuiz(quizId:number, usuarioId: number): Promise<PerguntaQuiz[]>{
    const perguntas = await prisma.pergunta.findMany({
        where: {
            quiz_id: quizId,
            quiz: {
                usuario_id: usuarioId,
                nota: null
            }

        }
    })
        return perguntas.map((pergunta)=> ({
        id: pergunta.id,
        enunciado: pergunta.enunciado,
        categoria: pergunta.categoria,
        opcoes: JSON.parse(pergunta.opcoes),
        respostaCerta: pergunta.resposta_certa,
        respostaUsuario: pergunta.resposta_usuario,
        acertou: Boolean(pergunta.acertou),
        quizId: pergunta.quiz_id,
    }))
}