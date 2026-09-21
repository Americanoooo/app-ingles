import { ResultSetHeader, RowDataPacket } from "mysql2";
import { getPool } from "./db";
import { QuizData, Pergunta, DadosQuiz, PerguntaBanco, AtualizarPergunta } from "@/types";

export async function SalvarQuiz(quizData: QuizData, perguntas: Pergunta[]) {
  const conn = await getPool().getConnection();
  const dados = []
  try{
    await conn.beginTransaction()


  const [quiz] = await conn.query<ResultSetHeader>(
    "INSERT INTO quiz (usuario_id, dificuldade, data, total_perguntas) VALUES (?,?,CURDATE(), ?)",
    [quizData.usuarioId, quizData.dificuldade, perguntas.length],
  );

const dadosQuiz : DadosQuiz= {
    quizId: quiz.insertId,
    todasPerguntas: []
  }
      for (const pergunta of perguntas) {
    const [perguntaUnica] = await conn.query<ResultSetHeader>(
    "INSERT INTO pergunta (enunciado, categoria, opcoes, resposta_certa, quiz_id) VALUES (?,?,?,?, ?)",
      [pergunta.enunciado,
      pergunta.categoria,
      JSON.stringify(pergunta.opcoes),
      pergunta.respostaCerta,
      quiz.insertId,]
    );

    dadosQuiz.todasPerguntas.push({
      id: perguntaUnica.insertId,
      enunciado: pergunta.enunciado,
      opcoes: pergunta.opcoes,
    })
  }
  dados.push(dadosQuiz)

  await conn.commit()
  return dados[0]
  }catch(err: unknown){
    await conn.rollback()
    throw err
  }finally{
    conn.release()


  }
}

export async function buscarQuiz(quizId:number, usuarioId: number){
    const [resultado]= await getPool().query<PerguntaBanco[]>(
        `SELECT pergunta.* FROM pergunta
        JOIN quiz ON pergunta.quiz_id = quiz.id
         WHERE pergunta.quiz_id =? AND quiz.usuario_id =?`,
        [quizId, usuarioId]
    )
    return resultado
}

export async function atualizarRespostas(quiz: AtualizarPergunta, usuarioId:number, notaCalculada:number){
   const conn = await getPool().getConnection();

   try{
      await conn.beginTransaction()
      await conn.query(
        `UPDATE quiz SET  nota = ? WHERE id = ? AND usuario_id = ?`,
        [notaCalculada, quiz.id, usuarioId ]
      )

      for (const pergunta of quiz.perguntas){
       await conn.query(
          `UPDATE pergunta SET resposta_usuario = ?, acertou = ? WHERE id=?`,
          [pergunta.resposta_usuario, pergunta.acertou, pergunta.id]
        )
      }
      await conn.commit()

   }catch(err: unknown){
          await conn.rollback()
          throw err
   }finally{
    conn.release()
  }


}

