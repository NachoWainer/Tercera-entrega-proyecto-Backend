import { Router } from "express";
import { notAdmin} from "../../middlewares/auth.js";
import {
    changeRole
} from "../../controllers/user.controller.js"

const router = Router();

router.get('/premium/:uid',notAdmin,changeRole) 
router.post('/:uid/documents',notAdmin,changeRole) 


export default router