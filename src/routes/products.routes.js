import { Router } from "express";
import {
    getProductsLimit,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
} from "../controllers/product.controller.js"

const router = Router();

router.get('/',getProductsLimit) // gets products by params limit and 
router.get('/:pid',getProductById) // get product by id 
router.post('/',createProduct)  
router.put('/:pid',updateProduct)
router.delete('/:pid',deleteProduct)



export default router



















