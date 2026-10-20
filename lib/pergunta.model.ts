import { ResultSetHeader, RowDataPacket } from "mysql2";
import { getPool } from "./db";
import { QuizData, Pergunta, DadosQuiz, PerguntaBanco, PerguntaQuiz, AtualizarPergunta } from "@/types";



export async function buscarQuiz(quizId:number, usuarioId: number): Promise<PerguntaQuiz[]>{
    const [resultado]= await getPool().query<PerguntaBanco[]>(
        `SELECT pergunta.* FROM pergunta
        JOIN quiz ON pergunta.quiz_id = quiz.id
         WHERE pergunta.quiz_id =? AND quiz.usuario_id =? AND quiz.nota IS NULL`,
        [quizId, usuarioId]
    )
    return resultado.map((pergunta)=> ({
        id: pergunta.id,
        enunciado: pergunta.enunciado,
        categoria: pergunta.categoria,
        opcoes: JSON.parse(pergunta.opcoes),
        respostaCerta: pergunta.resposta_certa,
        respostaUsuario: pergunta.resposta_usuario,
        acertou: Boolean(pergunta.acertou),
        quizId: pergunta.quiz_id,
    }))
}


export async function buscarPergunta(perguntaId:number, usuarioId:number): Promise<PerguntaQuiz | null>{
      const [resultado] = await getPool().query<PerguntaBanco[]>(
        `SELECT pergunta.* FROM pergunta
        JOIN quiz ON pergunta.quiz_id = quiz.id
         WHERE pergunta.id = ? AND quiz.usuario_id = ? AND quiz.nota IS NOT NULL`,
        [perguntaId, usuarioId]
      )
    const pergunta = resultado[0]
    if(!pergunta) return null
    return {
        id: pergunta.id,
        enunciado: pergunta.enunciado,
        categoria: pergunta.categoria,
        opcoes: JSON.parse(pergunta.opcoes),
        respostaCerta: pergunta.resposta_certa,
        respostaUsuario: pergunta.resposta_usuario,
        acertou: Boolean(pergunta.acertou),
        quizId: pergunta.quiz_id,
    }
}