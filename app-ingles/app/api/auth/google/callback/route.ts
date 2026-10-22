import { NextRequest, NextResponse } from "next/server";
import { createRemoteJWKSet, jwtVerify } from "jose";
import { createSession } from "@/lib/session";
import { entrarComGoogle } from "@/lib/models/usuario.model";

const chavesGoogle = createRemoteJWKSet(
  new URL("https://www.googleapis.com/oauth2/v3/certs")
);

export async function GET(request: NextRequest) {
  const { GOOGLE_CLIENT_ID, GOOGLE_REDIRECT_URL, GOOGLE_CLIENT_SECRET } =
    process.env;
  if (!GOOGLE_CLIENT_ID || !GOOGLE_REDIRECT_URL || !GOOGLE_CLIENT_SECRET) {
    throw new Error(
      "Variáveis de ambiente da Google não configuradas. Confira o .env",
    );
  }

  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");
  const error = request.nextUrl.searchParams.get("error");

  const stateCookie = request.cookies.get("google_state")?.value;

  if (!code || !state || error || !stateCookie || state !== stateCookie) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const respostaToken = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    body: new URLSearchParams({
      code: code,
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      redirect_uri: GOOGLE_REDIRECT_URL,
      grant_type: "authorization_code",
    }),
  });

  if (!respostaToken.ok) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const tokens = await respostaToken.json();
  let payloadVerificado
  try{
  const {payload}= await jwtVerify(tokens.id_token, chavesGoogle, {
    
    issuer: ["https://accounts.google.com", "accounts.google.com"],
    audience: GOOGLE_CLIENT_ID
  })
  payloadVerificado = payload
  }catch(err){
    console.error(err)
    payloadVerificado = null
}
  
  if(!payloadVerificado){
    return NextResponse.redirect(new URL("/login", request.url));

  }
 

    }
