import { HttpError, HTTP_STATUS } from "../utils/recursos.js";
import { getDAOS } from "../models/daos/indexDAO.js";

const {cartsDao} = getDAOS();


export class CartService{
    async getCarts(){
        const carts = await cartsDao.getCarts()
        return carts        
    } 
    async addCart() {
        const newCart = await cartsDao.createCart(payload)
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
    async deleteProduct(CartId,ProductId){
        if (!CartId || !ProductId) {
            throw new HttpError('Missing param', HTTP_STATUS.BAD_REQUEST);
        }
        const [cart,product] = await cartsDao.deleteProduct(CartId,ProductId)
        if (!cart) {
            throw new HttpError('cart not found', HTTP_STATUS.NOT_FOUND);
        }  
        if (!product) {
            throw new HttpError('product not found', HTTP_STATUS.NOT_FOUND);
        }  
        return cart        
    } 
    async addProduct(CartId,ProductId){
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
}

