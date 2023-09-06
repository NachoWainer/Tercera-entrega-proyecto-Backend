export class UserDTO {
    constructor(payload){
        this.name= `${payload.first_name} ${payload.last_name}`.trim(); 
        this.email= payload.email
        this.age = payload.age
    }
}