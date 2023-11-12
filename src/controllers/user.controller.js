import { UserDTO } from "../models/dtos/users.dtos.js";
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
        if (!data) {
            req.logger.error(`Error the change could not be compleated`);
            return res.status(404).send({message:"User not found"})}
        else {req.logger.info("Role changed succesfully");
        return res.status(200).send({message:"Role changed succesfully"})}}
        catch(error){
            req.logger.error(error)
            return res.status(500).send({message:"internal sercer error"})
        }
    }
    async documentUpload(req,res){
        const userId = req.params.uid;
        const folder = req.body.folder;
        const files = req.files;
      
        try {
            const updatedUser = await userService.uploadDocument(userId, folder, files);
        
            console.log('Archivos subidos:', files);
            res.send('Archivos subidos correctamente');
          } catch (error) {
            console.error('Error al cargar documentos:', error);
            res.status(error.status || 500).send(error.message);
          }
        }
    async getAllUsers(req,res){
        try {
            const user = await userService.getUsers()
            const users = []
            user.forEach(element => {
                let currentUser = new UserDTO(element)
                users.push(currentUser)
            })   
            res.status(200).send(users) 
        } catch (error) {
            console.log(error)
            res.status(404).send(error)
        }

    }
    async deleteUsers(req,res){
        try {
            const users = await userService.getUsers()
            let currentTime = new Date().getTime()

            await Promise.all(users.map(async (user) => {
                if (!user.last_connection || (currentTime - user.last_connection.getTime()) > 172800000){
                    await userService.deleteUsers(user._id, user.cart);
                }
            }));
            res.status(200).send("removed inactive users")
        } catch (error) {
            res.status(500).send("Innactive users could not be removed")
        }


    }
}

const productController = new ProductController()
const {
    changeRole,
    documentUpload,
    getAllUsers,
    deleteUsers
    
} = productController
export{
    changeRole,
    documentUpload,
    getAllUsers,
    deleteUsers
}