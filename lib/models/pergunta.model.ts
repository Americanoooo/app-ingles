import { prisma } from "../prisma";

export async function buscarPergunta(perguntaId: number, usuarioId: number) {
  const pergunta = await prisma.pergunta.findUnique({
    where: {
      id: perguntaId,
      quiz: {
        usuario_id: usuarioId,
        nota: { not: null },
      },
    },
  });
  if (!pergunta) return null;
  return {
    id: pergunta.id,
    enunciado: pergunta.enunciado,
    categoria: pergunta.categoria,
    opcoes: JSON.parse(pergunta.opcoes),
    respostaCerta: pergunta.resposta_certa,
    respostaUsuario: pergunta.resposta_usuario,
    acertou: Boolean(pergunta.acertou),
    quizId: pergunta.quiz_id,
  };
}
