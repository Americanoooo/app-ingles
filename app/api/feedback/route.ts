import { pegarUsuarioId } from "@/lib/auth";
import { erro500 } from "@/lib/respostas";


export async function POST(req: Request){
    try{
    try{
         await pegarUsuarioId()
    }catch{
      return Response.json({mensagem: 'Acesso negado. Token inválido.'}, {status:401})
    }
    
    const {enunciado, resposta_usuario, resposta_certa, categoria}= await req.json();
        if(!enunciado || !resposta_usuario|| !resposta_certa || !categoria){
            return Response.json({mensagem: 'Dados incompletos'}, {status:400})
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
                                    Resposta correta: "${resposta_certa}"
                                    Resposta do aluno: "${resposta_usuario}"

                                    Se o aluno acertou, confirme e explique por que está correto. Se errou, explique por que a resposta correta é a certa e por que a dele não serve. Responda em português, de forma simples e didática.`
                    },
                ],
                response_format: {
                    type: 'json_schema',
                    json_schema: {
                        name: 'feedback',
                        schema: {
                            type:'object',
                            properties: {
                                explicacao: {type: 'string'}
                            },
                            required: ['explicacao']
                        }
                    }
                }
            })
        })
        if(!resposta.ok){
             throw new Error(`Erro na API: ${resposta.status} - ${resposta.statusText}`);
        }
        const data = await resposta.json()
        const respostaFeedback = JSON.parse(data.choices[0].message.content)
        return Response.json(respostaFeedback, {status:200})

    }catch(err: unknown){
        console.error(err)
        return erro500()
    }
}