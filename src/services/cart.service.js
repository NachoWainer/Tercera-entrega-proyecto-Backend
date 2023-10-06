import { HttpError, HTTP_STATUS } from "../utils/utils.js";
import { getDAOS } from "../models/daos/indexDAO.js";

const {cartsDao} = getDAOS();


export class CartService{
    async getCarts(){
        const carts = await cartsDao.getCarts()
        return carts        
    } 
    async addCart() {
        const newCart = await cartsDao.createCart()
        return newCart
    }
    async getCartById(cartId) {
        if (!cartId) {
            throw new HttpError('Missing param', HTTP_STATUS.BAD_REQUEST);
          }
        const cart = await cartsDao.getCartById(cartId)
        if (!cart) {
            throw new HttpError('cart not found', HTTP_STATUS.NOT_FOUND);
        }   
        return cart    
    }
    async deleteProduct(cartId, productId) {
        if (!cartId || !productId) {
          throw new HttpError('Missing param', HTTP_STATUS.BAD_REQUEST);
        }      
        const [cart, product] = await cartsDao.deleteProduct(cartId, productId._id);
        if (!cart) {
          throw new HttpError('Cart not found', HTTP_STATUS.NOT_FOUND);
        }
        if (!product) {
          throw new HttpError('Product not found', HTTP_STATUS.NOT_FOUND);
        }
      
        return cart;
      }
    async addProductToCart(CartId,ProductId){
        if (!CartId || !ProductId) {
            throw new HttpError('Missing param', HTTP_STATUS.BAD_REQUEST);
        }
        const [cart,product] = await cartsDao.addProduct(CartId,ProductId)
        if (!cart) {
            throw new HttpError('cart not found', HTTP_STATUS.NOT_FOUND);
        }  
        
        if (!product) {
            throw new HttpError('product not found', HTTP_STATUS.NOT_FOUND);
        }  
        
        return cart 
    }


    /* try {
            const cart = await cartsModel.findById(cartId);

            if (!cart) {
            return res.send(
                { status: 'error', message: 'Carrito no encontrado', value: [] })
            }
            if (cart.products.length === 0) {
                await cartsModel.updateOne(
                    {_id: cartId},
                    {$push:{products:{_id: productId, quantity:1 }}})

                return res.send(
                    { status: 'success', message: 'producto agregado', value: [] })
            }
            else {
                let aux = await cartsModel.findOne(
                    { _id: cartId, "products._id": productId });
                if (aux == null){
                    await cartsModel.updateOne(
                        {_id: cartId},
                        {$push:{products:{_id: productId, quantity:1 }}})
                    return res.send(
                        { status: 'success', message: 'producto agregado', value: [] })
                }
                else {
                    await cartsModel.updateOne(
                        { _id: cartId, "products._id": productId },
                        { $inc: { "products.$.quantity": 1 }})
                    return res.send(
                        { status: 'success', message: 'producto agregado', value: [] })
                } 
            }
        } catch (error) {
            res.send({ status: 'error', message: error, value: [] });
        }*/}

