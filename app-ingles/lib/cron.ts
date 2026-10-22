import { getPrisma } from "./prisma";
import { ontemEmSaoPaulo } from "./datas";
import { CONTA_VISITANTE } from "./visitante";

// Só apaga quizzes de antes de ontem: a coluna data não tem hora, então um quiz
// começado às 23h ainda pode estar em andamento quando o cron roda à 01h.
export async function apagarPerguntasAbandonadas(){
    return getPrisma().pergunta.deleteMany({
        where: {
            quiz: {
                nota: null,
                data: { lt: ontemEmSaoPaulo() }
            }
        }
    })
}

export async function apagarQuizzesAbandonados(){
    return getPrisma().quiz.deleteMany({
        where: {
            nota: null,
            data: { lt: ontemEmSaoPaulo() }
        }
    })
}

export async function apagarHistoricoVisitante(){
    const email = CONTA_VISITANTE.email
    const prisma = getPrisma()
    // perguntas antes dos quizzes por causa da foreign key pergunta.quiz_id
    const [perguntas, quizzes] = await prisma.$transaction([
        prisma.pergunta.deleteMany({ where: { quiz: { usuario: { email } } } }),
        prisma.quiz.deleteMany({ where: { usuario: { email } } }),
    ])
    return {perguntas: perguntas.count, quizzes: quizzes.count}
}