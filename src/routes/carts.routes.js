import  {Router}  from "express";
import { adminRole,userRole } from "../middlewares/auth.js";

import{
    createCart,
    getCart,
    addProductToCart,
    deleteProductOfCart,
    updateProductsOfCart,
    updateProductQty,
    emptyCart,
    finishOrder
}from "../controllers/cart.controller.js"

const router = Router();

router.post('/',createCart) //create emptry cart
router.get('/:cid',getCart) // search cart by id
router.post('/:cid/product/:pid',userRole,addProductToCart); // search product in cart by id 
router.post('/:cid/purchase',userRole,finishOrder); // finish order
router.delete('/:cid/product/:pid',deleteProductOfCart) //removes product from cart by id
router.put ('/:cid',updateProductsOfCart) // updates all products of cart
router.put ('/:cid/products/:pid',userRole,updateProductQty) //updates product quantity in cart
router.delete('/:cid',emptyCart) // removes all products in cart

export default router