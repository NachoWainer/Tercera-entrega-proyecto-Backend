import { Router } from "express";
import { adminRole } from "../../middlewares/auth.js";
import {
    getProductsLimit,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
} from "../../controllers/product.controller.js"

const router = Router();

router.get('/',getProductsLimit) // gets products by params limit and 
router.get('/:pid',getProductById) // get product by id 
router.post('/',adminRole,createProduct)  
router.put('/:pid',adminRole,updateProduct)
router.delete('/:pid',adminRole,deleteProduct)



export default router



















