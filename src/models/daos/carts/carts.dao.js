import cartsModel from "../../schemas/carts.schema.js";

export class CartsDAO{
    async getCarts() {
        const carts = await cartsModel.find().lean();
        return carts;
      }
    async getCartById(id) {
      try {
        const carts = await cartsModel.findOne({ _id: id }).populate("products._id").lean();
        return carts;
        
      } catch (error) {
        return error
        
      }
        
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
      async  deleteProduct(cartId, productId) {
        try {
          const cart = await cartsModel.findOne({ _id: cartId }).lean();
      
          if (!cart) {
            throw new HttpError('cart not found', HTTP_STATUS.NOT_FOUND);
          }
      
          const productIndex = cart.products.findIndex((e) => e._id.equals(productId));
      
          if (productIndex !== -1) {
            const update = {
              $pull: { products: { _id: productId } }
            };
      
            await cartsModel.updateOne({ _id: cartId }, update);
      
            return [cart, { _id: productId }]; // Devolvemos el producto eliminado
          } else {
            return [cart, null]; // No se encontró el producto, devolvemos null
          }
        } catch (error) {
          console.error(error);
          return [null, null];
        }
      }
      async addProduct(CartId, ProductId) {
        try {
          const cart = await cartsModel.findOne({ _id: CartId }).lean();
          if (!cart) {
            throw new HttpError('cart not found', HTTP_STATUS.NOT_FOUND);
          }
          let product = cart.products.find((e) => e._id.equals(ProductId));
          if (product !== undefined) {
            product.quantity += 1;
            await cartsModel.updateOne({ _id: CartId }, cart);
          } else {
            product = { _id: ProductId, quantity: 1 }
            cart.products.push({ _id: ProductId, quantity: 1 });
            await cartsModel.updateOne({ _id: CartId }, cart);
          }
      
          return [cart, product]; 
        } catch (error) {
          console.error(error);
          throw error; 
        }
      }
}

       