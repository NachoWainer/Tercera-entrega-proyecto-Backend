import tokenModel from "../models/schemas/tolken.schema.js";
import Toastify from 'toastify-js'

export function anyRole(req,res,next){
    if (process.env.MODO === "TEST") next();
    else{
    const user = req.session.user;
    if (user && (user.role === 'usuario' || user.role === 'admin' || user.role === 'premium') ) next();
    else {
          
       res.redirect("/api/sessions/faillogin")}
}}

export function userRole(req,res,next){
    if (process.env.MODO === "TEST") next();
    else{
    const user = req.session.user;
    if (user && user.role === 'usuario') next();
    else res.status(403).send("access denied,must be user")
}}

export function adminRole(req,res,next){
    if (process.env.MODO === "TEST") next()
    else{
    const user = req.session.user;
    if (user && user.role === 'admin') next();
    else res.status(403).send("access denied, must be admin")}
}
export function premiumRole(req,res,next){
    if (process.env.MODO === "TEST") next();
    else{
    const user = req.session.user;
    if (user && (user.role === 'premium'|| user.role === 'admin' )) next();
    else res.status(403).send("access denied, must be premium or admin")}
}

export function notAdmin(req,res,next){
    if (process.env.MODO === "TEST") next()
    else{
    const user = req.session.user;
    if (user && !(user.role === 'admin')) next();
    else res.status(403).send("access denied, must be admin")}
}
export async function checkToken(req,res,next){
    const token = req.query.token
    if (!token) return res.status(403).send("access denied empty token")
    else{
        const access = await tokenModel.findOne({token: token})
        if (!access) {
        res.status(403).send("access denied wrong token")
        return}
        let currentTime = new Date().getTime()
        let tokenTime = access.date.getTime()
        
        if ((currentTime - tokenTime) >= 3600000){
            res.status(403).send("access denied token expired")
            await tokenModel.deleteOne({token: token})
            return
        }
        else{
            next()
        }
    }
}

export async function checkResetPassToken(req,res,next){
    const token = req.query.token
    if (!token) res.status(403).send("access denied empty token")
    else{
        const access = await tokenModel.findOne({token: token})
        if (!access) {
        res.status(403).send("access denied wrong token")
        return}
        let currentTime = new Date().getTime()
        let tokenTime = access.date.getTime()
        await tokenModel.deleteOne({token: token})
        if (currentTime - tokenTime >= 3600000){
            res.status(403).send("access denied token expired please start this process again")
            return
        }
        else{
            res.status(200).send("success")
            next()
        }
    }
}