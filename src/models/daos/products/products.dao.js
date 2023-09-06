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
        const data = await productsModel.find({_id:productId}).lean();  
        return data      
    }
    async updateProduct(productId, prop , value){
        const product = await productsModel.updateOne({_id: productId},{$set:{[prop]:value}});
        return product
    }

    async deleteProduct (productId){
       const product = await productsModel.deleteOne({id: productId})
        return product

    }



    
    
    
}