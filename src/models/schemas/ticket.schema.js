import {Schema, model} from "mongoose";

const collection = "Tickets"
const schema = new Schema({
    code: {
        type:String,
        required: true
    },
    purchase_datetime:{
        type:Date,
        default:Date.now
    },
    amount:{
        type:Number,
        required:true
    },
    purchaser:{
        type: String,
        required:true
    }       
})
const ticketsModel =model(collection,schema)
export default ticketsModel;