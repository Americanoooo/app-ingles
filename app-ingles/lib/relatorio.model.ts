import { RowDataPacket } from "mysql2";
import { getPool } from "./db";

export async function relatorio(usuario_id: number){
    const [resultado] = await getPool().query<RowDataPacket[]>(
        'SELECT * FROM quiz WHERE usuario_id = ?',
        [usuario_id]
    )
    return resultado
}