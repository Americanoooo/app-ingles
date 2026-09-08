import * as z from "zod"; 
import { badRequest, internalServerError } from "@/lib/respostas";

const RespostaIA = z.object({
    explicacao: z.string()
})

export async function POST(req: Request){
    try{
    const {enunciado, respostaUsuario, respostaCerta, categoria}= await req.json();
        if(!enunciado || !respostaUsuario|| !respostaCerta || !categoria){
            return badRequest()
        }
        const API_KEY = process.env.GEMINI_API_KEY;

        const resposta = await fetch(
            'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: 'gemini-3.5-flash-lite',
                messages: [
                    {
                        role: 'system',
                        content:'Você é um professor de inglês experiente. Explique de forma clara, simples e direta, sempre em português, em no máximo 3 frases.'
                    },
                    {
                        role: 'user',
                        content: `Um aluno respondeu uma questão de inglês sobre ${categoria}.
                                    Pergunta: "${enunciado}"
                                    Resposta correta: "${respostaCerta}"
                                    Resposta do aluno: "${respostaUsuario}"

                                    Se o aluno acertou, confirme e explique por que está correto. Se errou, explique por que a resposta correta é a certa e por que a dele não serve. Responda em português, de forma simples e didática.`
                    },
                ],
                response_format: {
                    type: 'json_schema',
                    json_schema: {
                        name: 'feedback',
                        strict: true,
                        schema: {
                            type:'object',
                            properties: {
                                explicacao: {type: 'string'}
                            },
                            required: ['explicacao'],
                            additionalProperties: false
                        }
                    }
                }
            })
        })
        
        if(!resposta.ok){
             throw new Error(`Erro na API: ${resposta.status} - ${resposta.statusText}`);
        }
        const data = await resposta.json()
        const respostaFeedback = data.choices?.[0]?.message?.content;

        if(!respostaFeedback){
            console.error("O modelo retornou um conteúdo vazio.");
            return internalServerError();
        }

        let jsonValidado: unknown
        try{
            jsonValidado = JSON.parse(respostaFeedback);
        }catch(err: unknown){
            console.error("Falha ao parsear string JSON da IA:", respostaFeedback)
            return internalServerError()
        }

        const resultadoZod = await RespostaIA.safeParseAsync(jsonValidado)

        if(!resultadoZod.success){
            console.error("Zod falhou ao validar o formato da IA:", resultadoZod)
            return internalServerError()
        }


        return Response.json(resultadoZod.data, {status:200})
       

    }catch(err: unknown){
        console.error("Erro crítico na Route Handler:", err)
        return internalServerError()
    }
}