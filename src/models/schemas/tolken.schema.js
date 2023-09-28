import {Schema, model} from "mongoose";


const collection='Access-Tokens'

const schema= new Schema({
    token:{
        type:String,
        required: true
    },
    date:{
        type:Date,
        default: new Date()
    }
})
const tokenModel =model(collection,schema)
export default tokenModel;