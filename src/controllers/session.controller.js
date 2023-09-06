import {UsersDAO} from "../models/daos/users/users.dao.js";
import { createHash, isValidPassword } from "../utils/utils.js";
import {UserDTO} from "../models/dtos/users.dtos.js"

class SessionController{
    async gitCallback(req,res){
        req.session.user=req.user
        res.redirect("/products")
    }
    async register(req,res){
        res.send({status:"success",message:"User Registered"})
    }

    async failRegister(req,res){
        res.send({error:"failed"})
    }
   async login (req,res){
        const {email , password} = req.body
        if (!req.user) return res.status(400).send({status:"error", error:"Wrong password"})
        req.session.user={
        first_name:req.user.first_name,
        last_name:req.user.last,
        age: req.user.age,
        email:req.user.email,
        password:req.user.password,
        cart:req.user.cart._id,
        rol:req.user.rol}
        res.send({status:"success",payload: req.user})
    }
    async failLogin(req,res){
        res.send({error:"failed"})
    }
    async recoverPass (req,res){
        const {email,password} = req.body
        if (!email||!password) return res.status(400).send({status:"error", error:"Missing user credentials"})
        const user = await UsersDAO.findOne({email})
        if (!user) return res.status(400).send({status:"error",error:"Incorrect credentials"})
        await UsersDAO.updateOne({ _id: user._id}, { password: createHash(password) })    
        return res.status(200).send({status:"ok",message:"Contraseña actualizada"})
    }
    async currentUser(req,res){
        const currentUser = UserDTO(req.session.user)
        res.send({staturs:"ok",message: currentUser})
    }

}
const sessionController = new SessionController()
const {
    gitCallback,
    register,
    failRegister,
    login,
    failLogin,
    recoverPass,
    currentUser
} = sessionController
export{
    gitCallback,
    register,
    failRegister,
    login,
    failLogin,
    recoverPass,
    currentUser
}