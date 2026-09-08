import { pegarUsuarioId } from "@/lib/auth";
import { salvarQuizCompleto } from "@/lib/pergunta.model";
import { badRequest, internalServerError } from "@/lib/respostas";
import { z } from "zod";


const responderSchema = z.object({
    dificuldade:z.number().int(),
    respostaQuiz: z.array(
        z.object({
            respostaCerta: z.string(),
            respostaUsuario: z.string(),
            enunciado: z.string(),
            categoria:z.string(),
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
    }));

    const nota =  perguntasCorrigidas.filter((r)=> r.acertou).length
    const quizData = {usuarioId, dificuldade, nota};
    
        await salvarQuizCompleto(quizData, perguntasCorrigidas)
            return Response.json({perguntasCorrigidas, acertou: nota}, {status:201})
    }catch(err:unknown){
        const error = err instanceof Error ? err.message : 'Erro ao salvar quiz'
        console.error(error)    
        return internalServerError()
    }


}