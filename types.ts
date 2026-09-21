import { RowDataPacket } from "mysql2";

export interface QuizData {
  usuarioId: number,
  dificuldade: number,
}

export interface DadosQuiz {
  quizId: number;
  todasPerguntas: PerguntaGerarQuiz[],
}


  export interface Quiz{
        id: number,
        usuarioId: number,
        dificuldade: number,
        nota: number,
        data: string,
        totalPerguntas: number
  }

  export interface PerguntaGerarQuiz{
    id: number,
    enunciado: string,
    opcoes: string[],
  }

export interface PerguntasFront{
  quizId: number,
  todasPerguntas: Pergunta[]
}

export interface Pergunta {
  perguntaId?: number,
  enunciado: string,
  categoria: "preposicao" | "tempo_verbal" | "contexto",
  opcoes: string[],
  respostaCerta?: string,
  respostaUsuario?: string,
  acertou?: boolean,
}


export interface PerguntaFeedback {
  enunciado: string,
  categoria: "preposicao" | "tempo_verbal" | "contexto",
  resposta_certa: string,
  resposta_usuario: string,
}


export interface PerguntaBanco extends RowDataPacket{
  id: number,
  enunciado: string,
  categoria: "preposicao" | "tempo_verbal" | "contexto",
  opcoes: string,
  resposta_certa: string,
  resposta_usuario: string,
  acertou: boolean,
}

export interface AtualizarPergunta {
  id:number,
  perguntas: PerguntaBanco[]
}


  export interface Resultado{
        resposta_certa: string,
        resposta_usuario: string,
        enunciado: string,
        categoria: "preposicao" | "tempo_verbal" | "contexto",
        opcoes:string[],
        acertou:boolean
    }