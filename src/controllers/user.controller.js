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
            const updatedUser = await usersService.uploadDocument(userId, folder, files);
        
            console.log('Archivos subidos:', files);
            res.send('Archivos subidos correctamente');
          } catch (error) {
            console.error('Error al cargar documentos:', error);
            res.status(error.status || 500).send(error.message);
          }
        }
}

const productController = new ProductController()
const {
    changeRole,
    documentUpload
    
} = productController
export{
   changeRole,
   documentUpload
}