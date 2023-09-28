import { generateRandomCode } from "../../middlewares/randomCode";
import tokenModel from "../../models/schemas/tolken.schema";
import { transporter } from "../../middlewares/mail";

const form= document.getElementById("recoverPassForm")

form.addEventListener("submit", async e =>{
    e.preventDefault()
    const data = new FormData(form)
    const obj={}
    data.forEach((value,key)=>obj[key] = value)
    try {
        const token = generateRandomCode(16)
        await tokenModel.create({token:token})
        const mailOptions = {
            from: 'nachocodertest@gmail.com',
            to: value,
            subject: 'Restablecer contraseña',
            text: `Para restablecer tu contraseña, haz clic en el siguiente enlace: 
                   http://localhost:8080/reset-password?token=${token}`,
          };
         const result = await transporter.sendMail(mailOptions)
        res.send('Mail enviado')
      } catch(error){
        console.log(error)
      }
    }); 