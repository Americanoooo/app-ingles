export function internalServerError(){
    return Response.json({mensagem: "Erro interno. Tente novamente." }, {status:500})
}

export function badRequest(){
    return Response.json({mensagem: "Dados inválidos. Tente novamente"}, {status: 400})
}

export function unauthorized(){
    return Response.json({mensagem: "Não autorizado"}, {status:401})
}