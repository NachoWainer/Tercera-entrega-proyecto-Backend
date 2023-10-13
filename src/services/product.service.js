import { getDAOS } from "../models/daos/indexDAO.js";
import { HttpError,HTTP_STATUS } from "../utils/utils.js";

const {productsDao} = getDAOS();
export class ProductService{

    async addProduct(user,
        title, description, code, price, status, stock, category, thumbnail){
            let message,stats,data
            if (!isNaN(title)||!isNaN(description)||!isNaN(category)||!isNaN(code))throw new HttpError('title description category and code must be text', HTTP_STATUS.BAD_REQUEST);
            if (title === undefined || title.replace(/\s/g, '') === "" || description.replace(/\s/g, '') === "" ||description === undefined || 
                category.replace(/\s/g, '') === ""|| category === undefined || price === undefined || code.replace(/\s/g, '') === ""|| code === undefined || stock === undefined) {
                    throw new HttpError('Missing param', HTTP_STATUS.BAD_REQUEST);
                    message='Missing param'
                    stats = 400
                    data = 0
            }
            if (status === undefined) status = true
            if (isNaN(stock) || Number(stock) === null || isNaN(price) || Number(price) === null) throw new HttpError('price and stock fields must be numbers', HTTP_STATUS.BAD_REQUEST);
            const content = await productsDao.getProducts();  
            if (content.find(element => element.code === code)){
                throw new HttpError('Code not available', HTTP_STATUS.BAD_REQUEST);
                message='Code not available'
                stats = 400
                data = 0
            }
            let owner = "admin"
            if (user != undefined && user.role === "premium") owner = user.email
            const product = await productsDao.addProduct(title, description, code, price, status, stock, category, thumbnail,owner)
            emitRealTimeProducts()
            if (product){
                message='OK'
                stats = 200
                data = product

            }
            return {stats,message,data}
    }

    async getProducts(filter) {
        const products = await productsDao.getProducts(filter)
        return products     
    }

    async getProductById(productId) { 
        if (!productId) {
            throw new HttpError('Missing param', HTTP_STATUS.BAD_REQUEST);
        }
        const product = await productsDao.getProductById(productId)
       
        if (!product) {
            throw new HttpError('product not found', HTTP_STATUS.NOT_FOUND);
        }
        return product  
    }

    async updateProduct(productId, prop , value){ 
        if (!productId) {
            throw new HttpError('Missing param', HTTP_STATUS.BAD_REQUEST);
        }
        if ("title" === prop || "description" === prop || "price" === prop ||
            "thumbnail" === prop || "code" === prop || "stock" === prop
            || "category" === prop || "status" === prop){
            if (("stock"===prop && isNaN(value)) || ("stock"===prop && Number(value) === null) || ("price"===prop && isNaN(value)) || ("price"===prop && Number(value) === null)) throw new HttpError('price and stock fields must be numbers', HTTP_STATUS.BAD_REQUEST);
            if (("title"===prop && !isNaN(value)) || ("title"===prop && value.replace(/\s/g, '') === "") || ("description"===prop && !isNaN(value)) || ("description"===prop && value.replace(/\s/g, '') === "")
            || ("code"===prop && !isNaN(value)) || ("code"===prop && value.replace(/\s/g, '') === "")) throw new HttpError('title description category and code must be text', HTTP_STATUS.BAD_REQUEST);
            const product = await productsDao.updateProduct(productId, prop , value)
            if (!product) {
                throw new HttpError('product not found', HTTP_STATUS.NOT_FOUND);
            }
            return product                       
        }
        else {
            throw new HttpError('Missing param', HTTP_STATUS.BAD_REQUEST); 
        }
    }

    async deleteProduct(productId){
        let message="error missing param"
        if (!productId) {
            throw new HttpError('Missing param', HTTP_STATUS.BAD_REQUEST);
            return message
        }
        const product = await productsDao.deleteProduct(productId)
        if (!product) {
            throw new HttpError('product not found', HTTP_STATUS.NOT_FOUND);
            return  message = "product not found"
            
        } 
        emitRealTimeProducts()
        message ="product deleted succesfully"
        return message
    } 
}

