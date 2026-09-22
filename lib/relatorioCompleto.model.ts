import { RowDataPacket } from "mysql2";
import { getPool } from "./db";

export async function buscarRelatorioCompleto(quizId: number, usuarioId: number ){

    const [resultado]= await getPool().query<RowDataPacket[]>(
        `SELECT pergunta.* FROM pergunta
        JOIN quiz ON pergunta.quiz_id = quiz.id
         WHERE pergunta.quiz_id =? AND quiz.usuario_id =?`,
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

