import { salvarQuizCompleto } from "@/lib/pergunta.model";

export const dynamic = "force-dynamic";

export async function POST(req: Request){

try{
     const {quizData, perguntas} = await req.json()
        if(!quizData || !perguntas){
                return Response.json({error: 'Dados incompletos'}, {status:400})
        }

    await salvarQuizCompleto(quizData, perguntas)
    return Response.json({mensagem: 'Perguntas cadastradas com sucesso', perguntas: perguntas}, {status: 201})
}catch(err:unknown){
                const error = err instanceof Error ? err.message : 'Não foi possível cadastrar o quiz'
                return Response.json({mensagem: 'Não foi possível cadastrar o quiz', error}, {status: 500})
        }
}