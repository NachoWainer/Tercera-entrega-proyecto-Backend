import express from 'express'
import { notAdmin, userRole } from "../middlewares/auth.js";
import{
    register,
    login,
    logout,
    realTimeProducts,
    chat,
    cartId,
    userCart,
    products,
    current,
    mockingProducts,
    testingLogs
} from "../controllers/view.controller.js"
import { changeRole } from '../controllers/user.controller.js';

const router= express.Router();

router.get("/register",register)
router.get("/", login)
router.get("/logout", logout)
router.get('/realtimeproducts',realTimeProducts)
router.get('/chat',userRole,chat)
router.get('/cart/:cid',cartId)
router.get('/cart',userCart)
router.get('/products',products)
router.get('/current',userRole,current)
router.get('/mockingProducts',userRole,mockingProducts)
router.get('/loggerTest',testingLogs)
router.get('/premium/:uid',notAdmin,changeRole) 
router.get("/recoverPass", recoverPass)
router.get("/reset-pass",checkToken,recoverPass)




export default router;
