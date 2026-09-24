import { apagarPerguntasAbandonadas, apagarQuizzesAbandonados } from "@/lib/cron";
import { unauthorized } from "@/lib/respostas";


export async function GET (req: Request){
    const authHeader = req.headers.get('authorization')
    if(authHeader !== `Bearer ${process.env.CRON_SECRET}`){
        return unauthorized()
    }
    try{
        const perguntas = await apagarPerguntasAbandonadas()
        const quizzes = await apagarQuizzesAbandonados()

        return Response.json({mensagem: `total de quizzes deletados ${quizzes.affectedRows}, total de perguntas ${perguntas.affectedRows}`}, {status:200})
    }catch(err){
        console.error(err)
    }
}