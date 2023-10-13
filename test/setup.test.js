import mongoose from "mongoose";
import "dotenv/config"
import productsModel from "../src/models/schemas/products.schema.js";
import cartsModel from "../src/models/schemas/carts.schema.js";
import usersModel from "../src/models/schemas/Users.model.js";

before(async()=>{
    await mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@codercluster.23a6ufo.mongodb.net/${process.env.MONGO_DB}`)
})
after(async ()=>{
    mongoose.connection.close()
})

export const dropProducts = async() =>{
    await productsModel.collection.drop()
}

export const dropCarts = async() =>{
    await cartsModel.collection.drop()
}

export const dropUsers = async() =>{
    await usersModel.collection.drop()
}