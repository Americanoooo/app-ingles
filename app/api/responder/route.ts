import { pegarUsuarioId } from "@/lib/auth";
import { salvarQuizCompleto } from "@/lib/pergunta.model";
import { badRequest, calcularNota, internalServerError } from "@/lib/respostas";
import { z } from "zod";


const responderSchema = z.object({
    dificuldade:z.number().int().min(1).max(3),
    respostaQuiz: z.array(
        z.object({
            respostaCerta: z.string(),
            respostaUsuario: z.string(),
            enunciado: z.string(),
            categoria:z.enum(["preposicao", "tempo_verbal", "contexto"]),
            opcoes:z.array(z.string())
        })

    )
    .min(1),
})

export const dynamic = "force-dynamic";

export async function POST(req: Request){


    try{
        const usuarioId = await pegarUsuarioId()

       const parse = responderSchema.safeParse( await req.json());
       if(!parse.success)
        return badRequest()
    const {dificuldade, respostaQuiz} = parse.data

    const perguntasCorrigidas = respostaQuiz.map((p)=> ({
        ...p,
        acertou: p.respostaCerta === p.respostaUsuario,
    })); //Alteração futura para ser validado com a resposta certa do banco de dados



    const acertou =  perguntasCorrigidas.filter((r)=> r.acertou).length
    const notaCalculada = calcularNota(acertou, respostaQuiz.length)
    const quizData = {usuarioId, dificuldade, notaCalculada};
    
        await salvarQuizCompleto(quizData, perguntasCorrigidas)
            return Response.json({perguntasCorrigidas, acertou}, {status:201})
    }catch(err:unknown){
        const error = err instanceof Error ? err.message : 'Erro ao salvar quiz'
        console.error(error)    
        return internalServerError()
    }


}