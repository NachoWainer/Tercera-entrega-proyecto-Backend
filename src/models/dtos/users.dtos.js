export class UserDTO {
    constructor(payload){
        this.full_name= `${payload.name} ${payload.lastName}`.trim(); 
        this.email= payload.email
        this.age = payload.age
    }
}