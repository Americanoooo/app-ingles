// A coluna quiz.data é DATE, então o "hoje" precisa ser o dia de São Paulo
// à meia-noite UTC, que é como o Prisma lê e grava datas sem hora.
export function hojeEmSaoPaulo(){
    const hoje = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Sao_Paulo" }).format(new Date())
    return new Date(hoje)
}

export function ontemEmSaoPaulo(){
    const ontem = hojeEmSaoPaulo()
    ontem.setUTCDate(ontem.getUTCDate() - 1)
    return ontem
}
