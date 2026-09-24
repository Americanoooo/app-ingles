import { ResultSetHeader } from "mysql2";
import { getPool } from "./db";

export async function apagarPerguntasAbandonadas(){
    const [resultado] = await getPool().query<ResultSetHeader>(
        `DELETE FROM pergunta 
WHERE quiz_id IN (SELECT id FROM quiz WHERE nota IS NULL AND data < CURDATE() );`
    )
    return resultado
}

export async function apagarQuizzesAbandonados(){
    const [resultado] = await getPool().query<ResultSetHeader>(
        `DELETE FROM quiz WHERE nota IS NULL AND data < CURDATE()`
    )
    return resultado
}
