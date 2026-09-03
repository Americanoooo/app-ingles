import 'server-only'
import { cookies } from 'next/headers'
import { SignJWT, jwtVerify }  from 'jose';

const {JWT_SECRET} = process.env
const encodedKey = new TextEncoder().encode(JWT_SECRET);

type SessionPayload = {userId: string; expiresAt: Date}
export async function encrypt(payload: SessionPayload){
    return await new SignJWT(payload)
    .setProtectedHeader({alg: "HS256"})
    .setIssuedAt()
    .setExpirationTime(payload.expiresAt)
    .sign(encodedKey)

}

export async function decrypt(session: string | undefined = ""){
    try{
    const {payload} = await jwtVerify(session, encodedKey, {
        algorithms: ['HS256'],
    });
        return payload

}catch(error){
    console.error(error)
    return null
}   
}

export async function createSession(userId: string) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  const session = await encrypt({ userId, expiresAt })
  const cookieStore = await cookies()
 
  cookieStore.set('session', session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production' ,
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  })
}