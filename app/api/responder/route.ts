import { pegarUsuarioId } from "@/lib/auth";
import { salvarQuizCompleto } from "@/lib/pergunta.model";
import { erro500 } from "@/lib/respostas";
import { z } from "zod";


const responderSchema = z.object({
    dificuldade:z.number().int(),
    respostaQuiz: z.array(
        z.object({
            resposta_certa: z.string(),
            resposta_usuario: z.string(),
            enunciado: z.string(),
            categoria:z.string(),
            opcoes:z.array(z.string())
        })
        
    )
    .min(1),
})

export const dynamic = "force-dynamic";

export async function POST(req: Request){
    let usuario_id : number
    try{
        usuario_id = await pegarUsuarioId()
    }catch{
        return Response.json({mensagem: 'Acesso negado. Token inválido.'}, {status:401})
    }

    
    try{
       const parse = responderSchema.safeParse( await req.json());
       if(!parse.success)
        return Response.json({mensagem: 'Dados inválidos', erros: parse.error.issues},
    {status: 400})
    const {dificuldade, respostaQuiz} = parse.data
    
    const perguntasCorrigidas = respostaQuiz.map((p)=> ({
        ...p,
        acertou: p.resposta_certa === p.resposta_usuario,
    }));
  
    const nota =  perguntasCorrigidas.filter((r)=> r.acertou).length
    const quizData = {usuario_id, dificuldade, nota};
    
        await salvarQuizCompleto(quizData, perguntasCorrigidas)
            return Response.json({perguntasCorrigidas, acertou: nota}, {status:201})
    }catch(err:unknown){
        const error = err instanceof Error ? err.message : 'Erro ao salvar quiz'
        console.error(error)    
        return erro500()
    }


}