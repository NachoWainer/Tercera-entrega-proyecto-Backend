import {Schema, model} from "mongoose";

const collection = "Users"
const schema = new Schema({
    first_name: String,
    last_name:String,
    email:String,
    age: String,
    password: String,
    cart:
        {
          _id:{
            type: Schema.Types.ObjectId,
            ref: 'carts'}
      },
    rol:{type:String, default:"usuario"}    
})
const usersModel =model(collection,schema)
export default usersModel;

