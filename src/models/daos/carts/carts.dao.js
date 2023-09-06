import cartsModel from "../../schemas/carts.schema.js";

export class CartsDAO{
    async getCarts() {
        const carts = await cartsModel.find().lean();
        return carts;
      }
    async getCartById(id) {
        const carts = await cartsModel.findOne({ _id: id }).lean();
        return carts;
      }
    
    async createCart(payload) {
        const newCart = await cartsModel.create(payload);
        return newCart;
      }
    
    async updateCart(id, payload) {
        const updatedCart = await cartsModel.updateOne({ _id: id }, {
          $set: payload
        });
        return updatedCart;
      }
    async deleteProduct(CartId,ProductId){
        let cart = await cartsModel.findOne({id:CartId}).lean()
        const product = cart.products.find(e => e._id === ProductId)
        cart = await cartsModel.updateOne({id: CartId},{$pull: {products:{id: ProductId}}})
        return{cart:cart,product:product}  
      }
    async addProduct(CartId,ProductId){
        const cart = await cartsModel.findOne({id:CartId}).lean() 
        const product = cart.products.find(e => e.id === ProductId)
        if (product !== undefined){ 
            product.quantity +=1
            await cartsModel.updateOne({id: CartId}, cart)}
        else {
            cart.products.push({id:ProductId, quantity:1})
            await cartsModel.updateOne({id: CartId}, cart)
        }
        return{cart:cart,product:product}
        }

       }