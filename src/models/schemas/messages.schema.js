import {Schema, model} from "mongoose";


const collection='messages'

const schema= new Schema({
    user:{
        type:String,
        required: true
    },
    message:{
        type:String,
        required: true
    }
})
const messagesModel =model(collection,schema)
export default messagesModel;