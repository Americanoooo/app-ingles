import { RowDataPacket } from "mysql2";
import { getPool } from "./db";

export async function relatorio(usuarioId: number){
    const [resultado] = await getPool().query<RowDataPacket[]>(
        'SELECT * FROM quiz WHERE usuario_id = ?',
        [usuarioId]
    )
    return resultado.map((quiz)=> ({
        id: quiz.id,
        usuarioId: quiz.usuario_id,
        dificuldade: quiz.dificuldade,
        nota: quiz.nota,
        data: quiz.data,
        totalPerguntas: quiz.total_perguntas,
    }))
}