import { Router } from "express";
import { notAdmin} from "../../middlewares/auth.js";
import multer from "multer";
import {
    changeRole,
    documentUpload,
    getAllUsers,
    deleteUsers
} from "../../controllers/user.controller.js"


const storage = multer.diskStorage({
    destination: (req,file,cb) =>{
      let store = "default"
      let folder =req.body.folder
      if (folder == "profiles") store = "profiles"
      else if (folder == "products") store = "products"
      else if  (folder == "documents") store = "documents"
      cb(null,`public/uploads/${store}`)
    },
    filename:(req,file,cb)=>{
      cb(null, `${Date.now()}-${file.originalname}`)
    },
  })
const upload = multer({ storage: storage });

const router = Router();

router.get('/premium/:uid',notAdmin,changeRole) 
router.post('/:uid/documents',upload.single('file'),documentUpload) //terminar

router.get('/',getAllUsers) //get all users dto (nombre correo rol)
router.delete('/',deleteUsers)// limpia todos los usuarios sin conexion en los utlimos 2 dias






export default router