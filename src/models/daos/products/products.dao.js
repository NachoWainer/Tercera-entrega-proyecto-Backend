import productsModel from "../../schemas/products.schema.js"

export class ProductsDAO{

   async getProducts(filter){
        const data = await productsModel.find(filter).lean();  
        return data
    }
    async addProduct(title, description, code, price, status, stock, category, thumbnail){
        const product={
            "title":title,
            "description":description,
            "code":code,
            "price":Number(price),
            "status":Boolean(status),
            "stock":Number(stock),
            "category":category,
            "thumbnail":thumbnail
        }
        const value = await productsModel.create(product)
        return value
    }
    async getProductById(productId) { 
        
        try {
            const data = await productsModel.findOne({_id: productId}).lean();
            if (!data) {
                throw new HttpError('Product not found', HTTP_STATUS.NOT_FOUND);
            }
            return data;
        } catch (error) {
            throw new HttpError('Error fetching product', HTTP_STATUS.INTERNAL_SERVER_ERROR);
        }
    }
    async updateProduct(productId, prop , value){
        const product = await productsModel.updateOne({_id: productId},{$set:{[prop]:value}});
        return product
    }

    async deleteProduct (productId){
       const product = await productsModel.deleteOne({_id: productId})
        return product

    }



    
    
    
}