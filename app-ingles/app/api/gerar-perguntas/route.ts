import { badRequest, IAResponseError, internalServerError } from "@/lib/respostas";
import * as z from "zod"; 


export const dynamic = "force-dynamic";

const RespostaIA= z.array(
    z.object({
      enunciado: z.string(), 
      categoria: z.enum(["preposicao", "tempo_verbal", "contexto"]), 
      opcoes: z.array(z.string()), 
          respostaCerta: z.string()

    }),
);

const GerarPerguntaSchema = z.object({
    quantidade: z
    .coerce.number()
    .min(1)
    .max(10),
    dificuldade: z
    .coerce.number()
    .min(1)
    .max(3)
})


export async function POST(req: Request) {
  try{
  
    const { dificuldade, quantidade } = await req.json();
    const input = await GerarPerguntaSchema.safeParseAsync({quantidade, dificuldade})
    if(!input.success){
      return badRequest()
    }



  const API_KEY = process.env.GEMINI_API_KEY;

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
            content: `Gere ${input.data.quantidade} perguntas para treinar o meu inglês na dificuldade ${input.data.dificuldade}, escolhe entre essas 3 categorias "preposicao", "tempo_verbal", "contexto"`,
          },
        ],
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "quiz",
            strict: true,
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
                  respostaCerta: { type: "string" },
                },
                required: [
                  "enunciado",
                  "categoria",
                  "opcoes",
                  "respostaCerta",
                ],
                additionalProperties: false,
              },
            },
          },
        },
      }),
    },
  );
  if(!resposta.ok){
    throw new Error(`Erro na API: ${resposta.status} - ${resposta.statusText}`);
  }

    const data = await resposta.json();
    const quizIA = data.choices[0].message.content
     if(!quizIA){
            console.error("O modelo retornou um conteúdo vazio.");
            return IAResponseError();
        }
      let quizValidado: unknown
        try{
          quizValidado = JSON.parse(quizIA)

        }catch(err:unknown){
            console.error("Falha ao parsear string JSON da IA:", quizIA)
            return IAResponseError()
        }

        const quiz = await RespostaIA.safeParseAsync(quizValidado)

        if(!quiz.success){
              console.error("Zod falhou ao validar o formato da IA:", quiz)
              return IAResponseError()
          
        }

      return Response.json(quiz.data, {status:200})
    }catch(err:unknown){
      const error = err instanceof Error ? err.message : 'Erro interno, tente novamente.'
      console.error(error)
       return internalServerError()
    }
  }
