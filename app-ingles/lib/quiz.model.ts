import { RowDataPacket } from "mysql2";
import { pool } from "./db";

export async function listaQuiz(usuario_id: number){
    const [resultado] = await pool.query<RowDataPacket[]>(
        'SELECT * FROM quiz WHERE usuario_id = ?',
        [usuario_id]
    )
    return resultado
}