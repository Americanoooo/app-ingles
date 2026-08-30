import  jwt  from "jsonwebtoken"
import { getJwtSecret} from "../app/api/config"

export  function pegarUsuarioId(req: Request){
 
    const authHeader = req.headers.get('authorization')
    const token = authHeader?.split(' ')[1]
    if(!token){ 
        throw new Error('Token não fornecido')
    }

    const payload = jwt.verify(token, getJwtSecret() as string)
    const {usuario_id} = payload as {usuario_id: number}
    return usuario_id
}

