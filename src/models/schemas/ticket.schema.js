import {Schema, model} from "mongoose";
import { generateRandomCode } from "../../middlewares/randomCode.js";


const collection = "Tickets"
const schema = new Schema({
    code: {
        type:String,
        required: true,
        default:generateRandomCode(10)
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