import express  from "express";
import { addLogger } from "../utils/logger.js";
import viewRouter from './router/app.router.js'
import handlebars from 'express-handlebars'
import mongoose from "mongoose";
import MongoStore from "connect-mongo";
import session from "express-session";
import sessionRouter from "./router/routes/sessions.router.js"
import "dotenv/config"
import initializedPassport from "./config/passport.config.js";
import passport from "passport";
import productsRouter from "./router/routes/products.routes.js"
import cartsRouter from "./router/routes/carts.routes.js"
import userRouter from "./router/routes/users.routes.js"
import { Server } from "socket.io"
import  productsModel  from "./models/schemas/products.schema.js"
import multer from "multer";


import { fileURLToPath } from "url";
import { dirname } from "path";
import messagesModel from "./models/schemas/messages.schema.js";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUiExpress from "swagger-ui-express"

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const swaggerOptions ={
  definition:{
    openapi: '3.0.0',
    info:{
      title:'Documentacion de las APIs',
      description: 'Ecommerce proyect',
      version: '1.0.0',
      contact: {
        name:"Ignacio Wainer" ,
        url: "https://www.linkedin.com/in/ignacio-wainer-29a1b4255/"

      } 
      
    }
  },
  apis:[`${process.cwd()}/src/docs/*.yaml`],
  //apis:[`${__dirname}/docs/**/*.yaml`]
}
const spec = swaggerJSDoc(swaggerOptions)


const app =express();
const PORT=8080;
const httpServer = app.listen(8080, ()=>console.log("Server running"))
const socketServer = new Server(httpServer)
app.use(addLogger)



mongoose.set('strictQuery',false)
const connection= mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@codercluster.23a6ufo.mongodb.net/${process.env.MONGO_DB}`
,{
  useNewUrlParser: true,
  useUnifiedTopology: true,

});
app.use(session({
  store: MongoStore.create({
    mongoUrl: `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@codercluster.23a6ufo.mongodb.net/${process.env.MONGO_DB}`,
    mongoOptions:{ useNewUrlParser: true, useUnifiedTopology: true},
    ttl:18000
  }),
  secret:`${process.env.MONGO_SECRET}`,
  resave:false,
  saveUninitialized:false
}))

initializedPassport()
app.use(passport.initialize())
app.use(passport.session())

app.engine('handlebars',handlebars.engine())
app.set('views',__dirname+'/views')
app.set('view engine','handlebars')

app.use(express.static(__dirname+'/public'))


app.use(express.json())
app.use(express.urlencoded({extended:true}))



app.use('/api/products',productsRouter)
app.use('/api/carts',cartsRouter)
app.use('/api/users',userRouter)

app.use('/',viewRouter)
app.use('/api/sessions',sessionRouter)
app.use('/apidocs',swaggerUiExpress.serve,swaggerUiExpress.setup(spec))




/////////////////////////MONGOOSE///////////////////////////////////////////

global.emitRealTimeProducts = async () => {
    const data = await productsModel.find().lean();  

    socketServer.emit('realTimeProducts', data);
  };

  global.emitProducts = async (data) => {
      
   socketServer.emit('products', data);
  }; 

socketServer.on('connection',async (socket) =>{
    console.log("Inicio la comunicación")
    const productos = await productsModel.find().lean();
    socket.emit('productos',productos)

    let realTimeProducts = await productsModel.find().lean();
    socket.emit('realTimeProducts',realTimeProducts)

    let messages=[]
    socket.on("message",async data=>{
    await messagesModel.create(data)

    messages.push(data)
    socket.emit("messageLogs",messages)
  })


//////////////////////////////FILE SYSTEM//////////////////////////////////////////////////    

/*
socketServer.on('connection',async (socket) =>{
    console.log("Inicio la comunicación")
    const products = await fs.promises.readFile("data/db/products.json",'utf-8')
    const productos = JSON.parse(products)
    socket.emit('productos',productos)

    let realTimeProducts = await fs.promises.readFile("data/products.json",'utf-8')
    realTimeProducts = JSON.parse(realTimeProducts)
    socket.emit('realTimeProducts',realTimeProducts)

    fs.watch("data/products.json",async()=>{
        realTimeProducts = await fs.promises.readFile("data/products.json",'utf-8')
        realTimeProducts = JSON.parse(realTimeProducts)
        socket.emit('realTimeProducts',realTimeProducts)
})*/

})
