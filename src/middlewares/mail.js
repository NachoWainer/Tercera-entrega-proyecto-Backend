
import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  port:587,
  auth: {
    user: 'nachocodertest@gmail.com',
    pass:`${process.env.MAIL_PASS}`,
  },
});



