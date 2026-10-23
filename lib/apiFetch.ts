import { ApiError } from "./apiError";

export async function apiFetch (endpoint:string, options: RequestInit = {}){
    const res = await fetch(endpoint, {
        ...options,
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
    });
    if(res.status ===401 && !endpoint.includes('api/login') && !endpoint.includes('api/cadastrar')){
        window.location.href='/login'; //Forçar reset total do estado
        throw new Error('Sessão expirada')
    }


    let data
    try{
     data = await res.json()

    }catch(error){
        console.error(error)
        throw new ApiError(res.status, 'Erro interno, Tente novamente.' )
    }

    if(!res.ok){
        throw new ApiError(res.status, data.mensagem || 'Erro na requisição')
    }
    return data

}