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

export async function apagarHistoricoVisitante(){
    const email = "visitante@visitante.com"
    const conexao = await getPool().getConnection()
    try{
        await conexao.beginTransaction()
        // perguntas antes dos quizzes por causa da foreign key pergunta.quiz_id
        const [perguntas] = await conexao.query<ResultSetHeader>(
            `DELETE p FROM pergunta p
             JOIN quiz q ON q.id = p.quiz_id
             JOIN usuario u ON u.id = q.usuario_id
             WHERE u.email = ?`,
            [email]
        )
        const [quizzes] = await conexao.query<ResultSetHeader>(
            `DELETE q FROM quiz q
             JOIN usuario u ON u.id = q.usuario_id
             WHERE u.email = ?`,
            [email]
        )
        await conexao.commit()
        return {perguntas: perguntas.affectedRows, quizzes: quizzes.affectedRows}
    }catch(err){
        await conexao.rollback()
        throw err
    }finally{
        conexao.release()
    }
}