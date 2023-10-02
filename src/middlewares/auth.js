import tokenModel from "../models/schemas/tolken.schema.js";

export function userRole(req,res,next){
    const user = req.session.user;
    if (user && user.role === 'usuario') next();
    else res.status(403).send("access denied,must be user")
}

export function adminRole(req,res,next){
    const user = req.session.user;
    if (user && user.role === 'admin') next();
    else res.status(403).send("access denied, must be admin")
}
export function premiumRole(req,res,next){
    const user = req.session.user;
    if (user && (user.role === 'premium'|| user.role === 'admin' )) next();
    else res.status(403).send("access denied, must be premium or admin")
}

export function notAdmin(req,res,next){
    const user = req.session.user;
    if (user && !(user.role === 'admin')) next();
    else res.status(403).send("access denied, must be admin")
}
export async function checkToken(req,res,next){
    const token = req.params.token
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
            res.status(403).send("access denied token expired")
        }
        else{
            res.status(200).send("success")
            next()
        }
    }
}