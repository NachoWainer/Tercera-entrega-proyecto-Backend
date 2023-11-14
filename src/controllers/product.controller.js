import { ProductService } from "../services/product.service.js"
import { transporter } from '../middlewares/mail.js';



const productService = new ProductService();
class ProductController {
    async getProductsLimit (req,res){
        const limit = req.query.limit
        const category = req.query.category
        let data;
       
        if(!category){ data = await productService.getProducts()}
        else{data = await productService.getProducts({category:category})}
        
        if (!limit) return res.send(data)
        else return res.send(data.slice(0,limit))
    }
    async getProductById (req,res){
        let id = req.params.pid
        const {status,message,data} = await productService.getProductById(id)
        if (data){
            return res.send(
                {status:status,message:`${message}`,value:data})
        req.logger.info(`${message}`);

        }
        else{ 
            return res.send(
                {status:status,message:`${message}`,value:data})  
        req.logger.info(`${message}`);

    
        }
    }

    async createProduct(req, res) {
        try {
          const { title, description, code, price, status, stock, category, thumbnail } = req.body;
          const user = req.session.user;
      
          // Validar que el usuario esté autenticado
          if (!user) {
            return res.status(401).json({ status: 401, message: 'User not authenticated', value: [] });
          }
      
          const { stats, message, data } = await productService.addProduct(
            user,
            title,
            description,
            code,
            price,
            status,
            stock,
            category,
            thumbnail,
            req.app.get('socket')
          );
      
          res.status(stats).json({ status: stats, message, value: data });
        } catch (error) {
          // Manejar otros errores internos del servidor
          res.status(500).json({ status: 500, message: 'Internal Server Error', value: [] });
          req.logger.error(`${error}`);
        }
      }
    async updateProduct(req,res){
        let id = req.params.pid
        const {title,
            description,
            code, 
            price, 
            status, 
            stock, 
            category, 
            thumbnail} = req.body
        const checkeo = ["title", "description", "code", "price", "status", "stock", "category", "thumbnail"]
        const result = []
        let contador = 0;
        for (let prop in req.body) {
            contador ++
            if (!checkeo.includes(prop)){
                result.push(
                    {"stats":404,"message":`La propiedad ${[prop]} no es válida`})
            }   
        }
        if (contador === 0) return res.send({"status":400,"message":"No se han solicitado cambios"})
        if (title !== undefined) result.push(await productService.updateProduct(id,"title",title))
        if (description !== undefined) result.push(await productService.updateProduct(id,"description",description))
        if (code !== undefined) result.push(await productService.updateProduct(id,"code",code))
        if (price !== undefined) result.push(await productService.updateProduct(id,"price",price))
        if (status !== undefined) result.push(await productService.updateProduct(id,"status",status))
        if (stock !== undefined) result.push(await productService.updateProduct(id,"stock",stock))
        if (category !== undefined) result.push(await productService.updateProduct(id,"category",category))
        if (thumbnail !== undefined) result.push(await productService.updateProduct(id,"thumbnail",thumbnail))
        res.send(result)
        req.logger.info("ok");

    }
    async deleteProduct (req,res){
        let id = req.params.pid
        let user = req.session.user
        let message = "error"
        let stats = "error"
        let data =[]
        if (user.role === "premium"){
            const product = await productService.getProductById(id)
            if (user.email === product.owner){ 
                let mailOptions = {
                    from: 'nachocodertest@gmail.com',
                    to: product.owner,
                    subject: 'Restablecer contraseña',
                    text: `Para restablecer tu contraseña, haz clic en el siguiente enlace: 
                           http://localhost:8080/reset-password?token=${token}&user=${email}`,
                  };
                 const result = await transporter.sendMail(mailOptions)
                 req.logger.info(result)
                return res.send('Mail enviado')
                let message = await productService.deleteProduct(id)
            } 
            else {
                 stats = 403
                 message = "Error, you do not own this product"
                 data = []
            }}
        else{
            if (user.email === product.owner){ 
                let mailOptions = {
                    from: 'nachocodertest@gmail.com',
                    to: product.owner,
                    subject: 'Restablecer contraseña',
                    text: `Para restablecer tu contraseña, haz clic en el siguiente enlace: 
                           http://localhost:8080/reset-password?token=${token}&user=${email}`,
                  };
                 const result = await transporter.sendMail(mailOptions)
                 req.logger.info(result)
             message = await productService.deleteProduct(id)
             stats = "OK"
             data = []}
        
        res.send({stats,message,data})
        req.logger.info(`${message}`);

    }
}
}


const productController = new ProductController()
const {
    getProductsLimit,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
} = productController
export{
    getProductsLimit,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
}