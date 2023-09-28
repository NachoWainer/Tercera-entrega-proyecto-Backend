import {UsersService } from "../services/users.service.js"



const userService = new UsersService();
class ProductController {
    async changeRole (req,res){
        const role = req.session.user.role
        let newRole; 
        (role === "premium") ? newRole =  "usuario" : newRole = "premium";
        try{
        const data = await userService.getUserByMail(req.session.user.email)
        await userService.updateUserRole(data._id,newRole)
        req.session.user.role = newRole
        if (!data) req.logger.error(`Error the change could not be compleated`);
        else req.logger.info("Role changed succesfully");
        return res.send({message:"Role changed succesfully"})}
        catch(error){
            req.logger.error(error)
        }
    }
}

const productController = new ProductController()
const {
    changeRole
    
} = productController
export{
   changeRole
}