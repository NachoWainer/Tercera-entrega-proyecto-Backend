import { Router } from "express";
import passport from "passport";
import{
    gitCallback,
    register,
    failRegister,
    login,
    failLogin,
    recoverPass,
    currentUser
}from "../controllers/session.controller.js"


const router = Router()
router.get("/github", passport.authenticate("github",{scope:["user:email"]}),async(req,res)=>{})
router.get("/githubcallback", passport.authenticate("github",{failureRedirect:"/"}),gitCallback)
router.post("/register", passport.authenticate("register",{failureRedirect:"/failregister"}),register)
router.get("/failregister",failRegister)
router.post("/login",passport.authenticate("login",{failureRedirect:"/faillogin"}), login)    
router.get("/faillogin", failLogin)
router.post("/recover", recoverPass)
router.get("/current", currentUser)
export default router 