import { expect } from "chai";
import supertest from "supertest";

/*
test user

const mockRegister ={
            "first_name":"test",
            "last_name":"prueba",
            "age":"23",
            "email":"test@test.com",
            "password":"1234"
        }



*/

const requester = supertest('http://localhost:8080')

describe("",()=>{

    it('[POST] /api/sessions',async()=>{
        const mockLogin ={
            "email":"test@test.com",
            "password":"1234"
        }
        const response = await requester.post('/api/sessions/login').send(mockLogin)    
        expect(response.statusCode).to.be.eql(200)
    })

})