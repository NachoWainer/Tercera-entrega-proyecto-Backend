
import {Schema, model} from "mongoose";
import mongoosePaginate from  "mongoose-paginate-v2"


const collection='products'

const schema= new Schema({
    title:{
        type:String,
        required: true
    },
    description:{
        type:String,
        required: true
    },
    code:{
        type:String,
        required: true
    },
    price:{type:Number,required:true},
    status:{type:Boolean,default:true},
    stock:{type:Number,required:true},
    category:{
        type:String,
        required:true
    },
    thumbnail:{type:String},
    owner:{type:String, default:"admin"}
})
schema.plugin(mongoosePaginate)

const productsModel =model(collection,schema)
export default productsModel;