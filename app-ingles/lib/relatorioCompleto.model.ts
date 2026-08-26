import { RowDataPacket } from "mysql2";
import { pool } from "./db";

export async function buscarRelatorioCompleto(quiz_id: number, usuario_id: number ){

    const [resultado]= await pool.query<RowDataPacket[]>(
        `SELECT pergunta.* FROM pergunta
        JOIN quiz ON pergunta.quiz_id = quiz.id
         WHERE pergunta.quiz_id =? AND quiz.usuario_id =?`,
        [quiz_id, usuario_id]
    )
    return resultado

}