import { expect } from "chai";
import { dropProducts } from "../setup.test.js";
import supertest from "supertest";
import "dotenv/config"



const requester = supertest('http://localhost:8080')

describe("",()=>{
    before(async()=>{
        await dropProducts();
        process.env.MODO = "TEST"
    })

    it('[POST] /api/products',async()=>{
        const mockProduct ={
                "title":"title",
                "description":"description",
                "code":"code",
                "price":Number(200),
                "status":Boolean(true),
                "stock":Number(200),
                "category":"category",
                "thumbnail":"thumbnail"
        }
        const response = await requester.post('/api/products').send(mockProduct)
        expect(response.statusCode).to.be.eql(200)
    })

})