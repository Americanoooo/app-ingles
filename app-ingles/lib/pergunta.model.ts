import { ResultSetHeader } from "mysql2";
import { getPool } from "./db";



interface QuizData {
  usuario_id: number,
  dificuldade: number,
  nota: number
}

interface Pergunta {
  enunciado: string,
  categoria: string,
  opcoes: string[],
  resposta_certa: string,
  resposta_usuario: string,
  acertou: boolean,
}

export async function salvarQuizCompleto(quizData: QuizData, perguntas: Pergunta[]) {
  const conn = await getPool().getConnection();
  try{
    await conn.beginTransaction()


  const [quiz] = await conn.query<ResultSetHeader>(
    "INSERT INTO quiz (usuario_id, dificuldade, nota, data, total_perguntas) VALUES (?,?,?,CURDATE(), ?)",
    [quizData.usuario_id, quizData.dificuldade, quizData.nota, perguntas.length],
  );


      for (const pergunta of perguntas) {
    await conn.query(
    "INSERT INTO pergunta (enunciado, categoria, opcoes, resposta_certa, resposta_usuario, acertou, quiz_id) VALUES (?,?,?,?,?,?, ?)",
      [pergunta.enunciado,
      pergunta.categoria,
      JSON.stringify(pergunta.opcoes),
      pergunta.resposta_certa,
      pergunta.resposta_usuario,
      pergunta.acertou,
      quiz.insertId,]
    );
  }
  
  await conn.commit()
  }catch(err: unknown){
    await conn.rollback()
    throw err
  }finally{
    conn.release()
  }
}
