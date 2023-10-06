
import { CartService } from "../services/cart.service.js"
import { ProductService } from "../services/product.service.js"
import { TicketService } from "../services/ticket.service.js"



const cartService = new CartService()
const productService = new ProductService()
const ticketService = new TicketService()

class CartController{
    async getAll(req,res){
        const carts = await cartService.getCarts()
        if (!carts) {
            req.logger.error("Carts not found")
            return res.status(404).send({message:"carts not found"})}
        
        req.logger.info("Carts retrieved successfully");
        return res.status(200).send({payload:carts})
    }

    async createCart(req,res){
        const newCart = await cartService.addCart()  
        if (newCart.error != 1) {
            req.logger.error("Failed to create cart");
            return res.status(403).send({message:"Failed to create cart"})}
        req.logger.info("Cart created successfully");
        res.status(200).send({message:"success"})}

    async getCart (req,res){
        let id = req.params.cid
        try {
            const cart = await cartService.getCartById(id)
            req.logger.info("Carts obtained successfully");
            res.send({status:"success",message:"Carrito obtenido correctamente",payload:cart.products})
        } catch (error) {
            req.logger.error("Failed to get cart");
            res.send({status:"error",message:error,payload:[]})}
    }

    async addProductToCart(req, res) {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const user = req.session.user
        try {
        if (user.role === "admin"){            
          await cartService.addProductToCart(cartId, productId);
          req.logger.info("product added successfully");
          res.status(200).send({ message: 'Producto agregado al carrito exitosamente' });}
          else{
            let product = await productService.getProductById(productId)
            if (product.owner === user.email){
                await cartService.addProductToCart(cartId, productId);
                req.logger.info("product added successfully");
                res.status(200).send({ message: 'Producto agregado al carrito exitosamente' });}
            else{
                req.logger.error("you cant add a product you own to the cart");
                res.status(400).send({ message: 'error - you cant add a product you own to the cart' })

            }
            } 

          }
         catch (error) {
            req.logger.error("Failed to add prodcut");
          res.status(500).send({ message: 'Error interno del servidor', error: error.message });
        }
      }

    async deleteProductOfCart(req,res){
        const cartId = req.params.cid;
        const productId = req.params.pid;
        try {
            await cartService.deleteProductOfCart(cartId,productId)
            req.logger.info("Prodcut deleted");
        } catch (error) {
            req.logger.error("Failed to delete prodcut");
            res.status(error).send({message:error})
        }
    }
    async deleteAllProducts(req,res){
        const cartId = req.params.cid;
        const productId = req.params.pid;
        try {
            await cartService.deleteAllProducts(cartId,productId)
            req.logger.info("All prodcuts deleted");

        } catch (error) {
            req.logger.error("Failed to delete all prodcuts");

            res.status(error).send({message:error})
        }
    }
    async updateProductsOfCart(req,res){
        let productos = req.body 
        const cartId = req.params.cid;
        try {
            const cart = await cartsModel.findById(cartId);
            if (!cart) {
                req.logger.warning;("Cart not found");
            return res.send(
                { status: "error", message: "Carrito no encontrado" });

            }
            if (productos.length === 0){
                req.logger.info;("Empty list of products to update");
                return res.send(
                    {status:"success", message: "no hay productos a agregar"})
            }
            productos.forEach(async element => {
                let aux = await cartsModel.findOne(
                    { _id: cartId, "products._id": element.payload._id });
                if (aux == null){
                    await cartsModel.updateOne({_id: cartId},
                        {$push:{products:{_id: element.payload._id, quantity:1 }}})
                }
                else {
                    await cartsModel.updateOne(
                        { _id: cartId, "products._id": element.payload._id },
                        { $inc: { "products.$.quantity": 1 }})
                } 
                
            })
            req.logger.info;("product updated");
            return res.send({ status: 'success', message: 'producto agregado', value: [] })    

        } catch (error) {
            req.logger.error;("Server error");
            res.status(500).send(
                { message: "Error en el servidor" });
        }
    }

   
    async finishOrder(req, res) {
        try {
          const cartId = req.params.cid;
          const cart = await cartService.getCartById(cartId);
      
          // Verifica si cart y cart.products están definidos antes de iterar
          if (cart && cart.products && Array.isArray(cart.products)) {
            const productosComprados = [];
            const productosNoComprados = [];
            let totalCompra = 0;
      
            await Promise.all(cart.products.map(async (product) => {
              const quantity = product.quantity;
              const availStock = await productService.getProductById(product._id);
              const stock = availStock.stock;
              if (quantity > stock) {
                productosNoComprados.push(product._id);
              } else {
                await productService.updateProduct(product._id, "stock", stock - quantity);
                productosComprados.push(product._id);
                totalCompra = totalCompra + (availStock.price * quantity);
              }
            }));
            req.logger.info;("List of unbought products",productosNoComprados);
            await Promise.all(productosComprados.map(async (product) => {
                await cartService.deleteProduct(cartId, product._id);
              }));    
      
            const ticket = await ticketService.createTicket(
              cartId,
              req.session.user.email,
              totalCompra,
            );
            
            res.send({ payload: ticket });
          } else {
            req.logger.error("Cart or cart products are undefined or not an array");
            res.status(400).json({ error: 'Cart or cart products are undefined or not an array' });
          }
        } catch (error) {
        req.logger.error('Error al procesar la orden');
          res.status(500).json({ error: 'Error al procesar la orden' });
        }
      }
      
      
    async updateProductQty(req,res){
        let {cantidad} = req.body 
        cantidad = parseInt(cantidad)
        if (cantidad < 0) {
        req.logger.warning('invalid quantity');
            return res.send(
                { status: 'error', message: 'cantidad invalida', value: [] })
        }   
        const cartId = req.params.cid;
        const productId = req.params.pid;
        try {
            const cart = await cartsModel.findById(cartId);
            if (!cart) {
        req.logger.warning('Cart not found');

            return res.send(
                { status: "error", message: "Carrito no encontrado" });
            }
            let aux = await cartsModel.findOne(
                { _id: cartId, "products._id": productId});
            if (aux == null){
                await cartsModel.updateOne(
                    {_id: cartId},
                    {$push:{products:{_id: productId, quantity: cantidad }}})
                return res.send(
                    { status: 'success', message: 'producto agregado', value: [] })   
            }
            else {
                await cartsModel.updateOne(
                    { _id: cartId, "products._id": productId },
                    { "products.$.quantity": cantidad })
            } 
        req.logger.info('Quantity updated succesfully');

            return res.send(
                { status: 'success', message: 'cantidad actualizada', value: [] })    
        } catch (error) {
        req.logger.error('Server Error');

            res.status(500).send(
                { message: "Error en el servidor" });
        }
    }
    async emptyCart(req,res){
        let CartId = req.params.cid
        try {
            const cart = await cartsModel.findById(CartId);
            if (!cart) {
                return res.send(
                    { status: "error", message: "Carrito no encontrado" });
            }
            await cartsModel.updateOne(
                { _id: CartId},
                { $set: { products: [] } })
        req.logger.info('Cart emptied succesfully');

            res.send(
                {status:"success",message:"se eliminaron todos los productos del carrito ",value:[]})
        } catch (error) {
        req.logger.error('Server Error');

            res.send({status:"error",message:error,value:[]})   
        }
    }
   
}
const cartController = new CartController()
const {
    getAll,
    createCart,
    getCart,
    addProductToCart,
    deleteAllProducts,
    deleteProductOfCart,
    updateProductsOfCart,
    updateProductQty,
    emptyCart,
    finishOrder

} = cartController
export{
    getAll,
    createCart,
    getCart,
    addProductToCart,
    deleteAllProducts,
    deleteProductOfCart,
    updateProductsOfCart,
    updateProductQty,
    emptyCart,
    finishOrder
}