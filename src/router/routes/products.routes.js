import { Router } from "express";
import { adminRole, anyRole, premiumRole,  } from "../../middlewares/auth.js";
import {
    getProductsLimit,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
} from "../../controllers/product.controller.js"

const router = Router();

router.get('/',anyRole,getProductsLimit)  
router.get('/:pid',getProductById) 
router.post('/',premiumRole,createProduct)  
router.put('/:pid',adminRole,updateProduct)
router.delete('/:pid',premiumRole,deleteProduct)



export default router



















