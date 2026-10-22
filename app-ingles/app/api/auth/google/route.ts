import { NextResponse } from "next/server";
import { randomBytes } from "crypto";

export async function GET (){

     const {GOOGLE_CLIENT_ID, GOOGLE_REDIRECT_URL} = process.env
     if(!GOOGLE_CLIENT_ID || !GOOGLE_REDIRECT_URL){
        throw new Error('Variáveis de ambiente da Google não configuradas. Confira o .env')
    }

    const state = randomBytes(32).toString("hex")


    const url = new URL("https://accounts.google.com/o/oauth2/v2/auth")
    url.searchParams.set("client_id", GOOGLE_CLIENT_ID)
    url.searchParams.set("redirect_uri", GOOGLE_REDIRECT_URL)
    url.searchParams.set("response_type", "code")
    url.searchParams.set("scope", "openid email profile")
    url.searchParams.set("state", state)

    const resposta = NextResponse.redirect(url)
    resposta.cookies.set("google_state", state, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 10,
        path:"/api/auth/google/callback"
    })
    return resposta
}