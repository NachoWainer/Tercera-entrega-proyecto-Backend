import {Schema, model} from "mongoose";
import mongoosePaginate from  "mongoose-paginate-v2"



const collection='carts'

const schema= new Schema({
    products: [
        {
          _id:{
            type: Schema.Types.ObjectId,
            ref: 'products'},
        quantity:{type:Number}
      }
      
    ]
})
schema.plugin(mongoosePaginate)
const cartsModel =model(collection,schema)
export default cartsModel;