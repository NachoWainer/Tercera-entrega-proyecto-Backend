import { expect } from "chai";
import { dropCarts } from "../setup.test.js";
import supertest from "supertest";


const requester = supertest('http://localhost:8080')

describe("",()=>{
    before(async()=>{
        await dropCarts();
        process.env.MODO = "TEST"

    })

    it('[POST] /api/carts',async()=>{
        const response = await requester.post('/api/carts')
        expect(response.statusCode).to.be.eql(200)
    })

})
describe("",()=>{
    before(async()=>{
        await dropCarts();
        process.env.MODO = "TEST"

    })

    it('[POST] /api/carts',async()=>{
        const response = await requester.post('/api/carts')
        expect(response.statusCode).to.be.eql(200)
    })

})