export class BaseOutDto {
    result: boolean;
    errorMessage: string;
    exists: boolean;
    limite: boolean;

    constructor(){
        this.result = false;
        this.errorMessage = '';
        this.exists = false;
        this.limite = false;
    }
}