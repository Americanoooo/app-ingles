import { pegarUsuarioId } from "@/lib/auth";
import { erro500 } from "@/lib/respostas";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try{

    try{
      await pegarUsuarioId()
    }catch{
      return Response.json({mensagem: 'Acesso negado. Token inválido.'}, {status:401})
    }



  const API_KEY = process.env.GEMINI_API_KEY;
  const { dificuldade, quantidade } = await req.json();
  if(!dificuldade || !quantidade || Number(quantidade) < 1){
    return Response.json({error: "Dificuldade e quantidade são obrigatórias"}, {status:400})
  }
  const resposta = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: "gemini-3.5-flash-lite",
        messages: [
          {
            role: "user",
            content: `Gere ${quantidade} perguntas para treinar o meu inglês na dificuldade ${dificuldade}, escolhe entre essas 3 categorias "preposicao", "tempo_verbal", "contexto"`,
          },
        ],
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "quiz",
            schema: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  enunciado: { type: "string" },
                  categoria: {
                    type: "string",
                    enum: ["preposicao", "tempo_verbal", "contexto"],
                  },
                  opcoes: { type: "array", items: { type: "string" } },
                  resposta_certa: { type: "string" },
                },
                required: [
                  "enunciado",
                  "categoria",
                  "opcoes",
                  "resposta_certa",
                ],
              },
            },
          },
        },
      }),
    },
  );
  const data = await resposta.json();
  const quiz = JSON.parse(data.choices[0].message.content );
  return Response.json({quiz}, {status:200})
  }catch(err:unknown){
    const error = err instanceof Error ? err.message : 'Erro ao gerar quiz'
    console.error(error)
    return erro500()
  }
}
