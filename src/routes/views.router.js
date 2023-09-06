import express from 'express'
import{
    register,
    login,
    logout,
    realTimeProducts,
    chat,
    cartId,
    userCart,
    products,
    current
} from "../controllers/view.controller.js"

const router= express.Router();

router.get("/register",register)
router.get("/", login)
router.get("/logout", logout)
router.get('/realtimeproducts',realTimeProducts)
router.get('/chat',chat)
router.get('/cart/:cid',cartId)
router.get('/cart',userCart)
router.get('/products',products)
router.get('/current',current)




export default router;
