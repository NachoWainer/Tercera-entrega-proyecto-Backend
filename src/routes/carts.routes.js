import  {Router}  from "express";
import{
    create,
    getCart,
    getProductOfCart, 
    deleteProductOfCart,
    updateProductsOfCart,
    updateProductQty,
    emptyCart
}from "../controllers/cart.controller.js"

const router = Router();

router.post('/',create) //create emptry cart
router.get('/:cid',getCart) // search cart by id
router.post('/:cid/product/:pid',getProductOfCart); // search product in cart by id 
router.delete('/:cid/product/:pid',deleteProductOfCart) //removes product from cart by id
router.put ('/:cid',updateProductsOfCart) // updates all products of cart
router.put ('/:cid/products/:pid',updateProductQty) //updates product quantity in cart
router.delete('/:cid',emptyCart) // removes all products in cart

export default router