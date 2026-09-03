import { erro500 } from "@/lib/respostas";
import { cookies } from "next/headers";


export async function POST(){
    try{
    const cookieStore = await cookies()
    cookieStore.delete('session');
    return Response.json({mensagem: 'Deslogado'}, {status:200})
    }catch{
        return erro500()
    }
}