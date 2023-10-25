import { Router } from "express";
import { notAdmin} from "../../middlewares/auth.js";
import {
    changeRole,
    documentUpload
} from "../../controllers/user.controller.js"

const router = Router();

router.get('/premium/:uid',notAdmin,changeRole) 
router.post('/:uid/documents',upload.single('file'),documentUpload) //terminar

export default router