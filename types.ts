export interface QuizData {
  usuarioId: number,
  dificuldade: number,
  notaCalculada: number 
}


  export interface Quiz{
        id: number,
        usuarioId: number,
        dificuldade: number,
        nota: number,
        data: string,
        totalPerguntas: number
  }

export interface Pergunta {
  enunciado: string,
  categoria: "preposicao" | "tempo_verbal" | "contexto",
  opcoes: string[],
  respostaCerta: string,
  respostaUsuario?: string,
  acertou?: boolean,
}



  export interface Resultado{
        respostaCerta: string,
        respostaUsuario: string,
        enunciado: string,
        categoria: "preposicao" | "tempo_verbal" | "contexto",
        opcoes:string[],
        acertou:boolean
    }