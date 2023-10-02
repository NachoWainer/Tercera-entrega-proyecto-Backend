import productsModel  from '../models/schemas/products.schema.js';
import cartsModel from '../models/schemas/carts.schema.js';
import usersModel from '../models/schemas/Users.model.js';
import session from 'express-session';
import { UserDTO } from '../models/dtos/users.dtos.js';
import { createHash, generateProduct, isValidPassword } from '../utils/utils.js';
import { generateRandomCode } from '../middlewares/randomCode.js';
import tokenModel from '../models/schemas/tolken.schema.js';
import { transporter } from '../middlewares/mail.js';




class ViewController{
    register (req,res){res.render("register")}
    login (req, res) {res.render("login")}
    async current (req, res) {
        try{
            let user = await req.session.user           
            if (user == undefined) return res.redirect("/")
            const userDTO = new UserDTO(user)
            res.render("current",{user: userDTO})
        }catch(error){
            console.error(error);
        res.status(500).send("Internal Server Error");

        }
        
        }
    logout (req,res){
        req.session.destroy(error => {
            if (error) res.json({error: "error logout", mensaje: "Error al cerrar sesion"})
            res.send("sesion cerrada correctamente")
        })
    }
    realTimeProducts (req,res){ res.render('realTimeProducts',{})}
    async chat (req,res){res.render('chat',{})}

    async cartId (req,res){
        let cartId =req.params.cid
        const cart = await cartsModel.findById(cartId).lean()
        const products = cart.products
        res.render('cart',{
           cart,
           products
        })
       }
       async userCart(req,res){
        let user = req.session.user
        let cartId =user.cart
        const cart = await cartsModel.findOne({_id:cartId}).populate("products._id").lean()
        const products = cart.products
       
       res.render('cart',{
            user,
           cart,
           products
       })
       }
    

       async products(req,res){

        const page=(req.query.page!=undefined) ? parseInt(req.query.page) : 1
        const limite = (req.query.limit != undefined) ? parseInt(req.query.limit) : 10 
        let sort = null
        let sortParam = req.query.sort
        if (sortParam != undefined){
            if (sortParam == "asc") sort = {price:1}
            if (sortParam == "desc") sort = {price:-1}
        }  
        let query = {}
        const queryParam = (req.query.query != undefined) ? req.query.query : null 
        if  (queryParam !== undefined ) {
            if (queryParam == "disponibilidad") query = {stock: {$gt: 0}}
            query = {categoria: {$eq: queryParam}}
        }  
           
    try {
        const{docs,hasPrevPage,hasNextPage,nextPage,prevPage,totalPages} = await productsModel.paginate({},{limit:limite,page,sort:sort,query,lean:true})
        let user = req.session.user
        const payload =docs 
        const status = "success"
        const nextLink=hasNextPage ? `page=${nextPage}&limit=${limite}` : null
        const prevLink= hasPrevPage ? `page=${prevPage}&limit=${limite}` : null
        let admin = (user.role === "admin" || user.role === "premium") ? true : false
        
          res.render("products",{
            status,
            payload,
            totalPages,
            prevPage,
            nextPage,
            page,
            hasPrevPage,
            hasNextPage,
            nextLink,
            prevLink,
            user,
            admin  
        })
        
    } catch (error) {
    
        const payload = []
        const prevPage = ""
        const nextPage = ""
        const status = "error"
        const hasNextPage = false
        const hasPrevPage = false
        const totalPages = 0
        const page = 0
        const nextLink=hasNextPage  ? `/?page=${nextPage}` : " "
        const prevLink= hasPrevPage ? `/?page=${prevPage}` : " "
    
          res.render("products",{
            status,
            payload,
            totalPages,
            prevPage,
            nextPage,
            page,
            hasPrevPage,
            hasNextPage,
            nextLink,
            prevLink  
        
        })
    }
    }
    async mockingProducts (req,res){
        const totalProducts = req.query.total || 100
        const fakerProducts = Array.from({length:totalProducts},()=>generateProduct())
       return res.send({status:200,message:"OK",payload:fakerProducts})
    }  

    async testingLogs(req,res){
        req.logger.fatal("¡");
        req.logger.error("HOLA");
        req.logger.info("ESTO");
        req.logger.warning('FUNCIONA');
        req.logger.http("!");
        req.logger.debug('MODO DESARROLLO');
    }  
    
    async recoverPass(req,res){
        res.render("recoverPassword")
    }
    async setRecoverPass(req,res){
        const email = req.body.email
        
        try {
            let user = await usersModel.findOne({email:email})

            if (!user) {return res.status(404).send({message:"user not found"})}
            const token = generateRandomCode(16)
            await tokenModel.create({token:token})
            
            const mailOptions = {
                from: 'nachocodertest@gmail.com',
                to: email,
                subject: 'Restablecer contraseña',
                text: `Para restablecer tu contraseña, haz clic en el siguiente enlace: 
                       http://localhost:8080/reset-password?token=${token}&user=${email}`,
              };
             const result = await transporter.sendMail(mailOptions)
             req.logger.info(result)
            return res.send('Mail enviado')
          } catch(error){
            req.logger.error(error)
          }
    }
    async resetPass(req,res){
        let person = req.query.user
        let token = req.query.token
        res.render("reset-password",{token:token,user:person})
    }
    async changePassword(req, res) {
        let user = req.query.user;
        let newPassword = req.body.password; // Suponemos que el nuevo campo de contraseña se llama "password"
      
        try {
          const usuario = await usersModel.findOne({ email: user });
      
          if (!usuario) {
            req.logger.error("User not found");
            return;
          }
          if (isValidPassword(usuario, newPassword)) {
            req.logger.info("Your new password must be different from your old password");
            return;
          }
          newPassword = createHash(newPassword);
          const result = await usersModel.updateOne({ email: user }, { password: newPassword });
      
          if (result) {
            req.logger.info("Password updated successfully");
            return;
          } else {
            req.logger.error("Failed to update password");
            return;
          }
        } catch (error) {
          req.logger.error(error);
          return;
        }
      }
}

const viewController = new ViewController()

const {
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
    testingLogs,
    recoverPass,
    setRecoverPass,
    resetPass,
    changePassword
    
} = viewController
export{
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
    testingLogs,
    recoverPass,
    setRecoverPass,
    resetPass,
    changePassword
  
}