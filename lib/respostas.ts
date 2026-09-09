export function internalServerError(){
    return Response.json({mensagem: "Erro interno. Tente novamente." }, {status:500})
}

export function badRequest(){
    return Response.json({mensagem: "Dados inválidos. Tente novamente"}, {status: 400})
}

export function unauthorized(){
    return Response.json({mensagem: "Não autorizado"}, {status:401})
}

export function calcularNota(total_perguntas_certas: number, total_perguntas:number): number{
 
     if(total_perguntas_certas ===0) return 0
    let nota: number | string = total_perguntas_certas/total_perguntas * 10
    nota = nota.toFixed(2)
    return Number(nota)




}