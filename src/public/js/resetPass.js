import { generateRandomCode } from "../../middlewares/randomCode";
import tokenModel from "../../models/schemas/tolken.schema";
import { transporter } from "../../middlewares/mail";

const form= document.getElementById("recoverPassForm")

form.addEventListener("submit", async e =>{
    user = req.query.user
    token = req.query.token
    e.preventDefault()
    const data = new FormData(form)
    const obj={}
    data.forEach((value,key)=>obj[key] = value)
    try {
        
        res.send('Mail enviado')
      } catch(error){
        console.log(error)
      }
    }); 