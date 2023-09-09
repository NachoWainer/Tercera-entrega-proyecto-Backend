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