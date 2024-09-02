export default class UserExistError extends Error {
    constructor(message:string){
        super('');
        this.name = this.constructor.name;
        this.stack = message + "; " + this.stack;
    }
}