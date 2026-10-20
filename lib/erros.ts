export class EmailJaCadastradoError extends Error {
    constructor( message: string){
        super(message);
        this.name = "EmailJaCadastradoError"
    }
}
