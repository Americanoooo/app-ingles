export function erro500(){
    return Response.json({error: "Erro interno. Tente novamente." }, {status:500})
}