import { HttpError, HTTP_STATUS } from "../utils/recursos.js";
import { getDAOS } from "../models/daos/indexDAO.js";

const { ticketsDao, productsDao, cartsDao, usersDao } = getDAOS();

export class ticketService {
    async getTickets() {
      const tickets = await ticketsDao.getTickets();
      return tickets;
    }

    async getTicketById(id) {
      if (!id) {
        throw new HttpError('Missing param', HTTP_STATUS.BAD_REQUEST)
      }
      const order = await ticketsDao.getTicketById(id);
      if (!order) {
        throw new HttpError('Ticket not found', HTTP_STATUS.NOT_FOUND)
      }
      return order;
    }

    async createTicket(payload) {
      const { cart, user, products } = payload;
     if (!cart || !user) {
        throw new HttpError('`cart` and `user` are required fields', HTTP_STATUS.BAD_REQUEST);
      }
      
      const cartDB = await cartsDao.getCartById(cart);
      if (!cartDB) {
        throw new HttpError('Cart not found', HTTP_STATUS.BAD_REQUEST);
      }

      const userDB = await usersDao.getUserById(user);
      if (!userDB) {
        throw new HttpError('User not found', HTTP_STATUS.BAD_REQUEST);
      }

      if (!products || !Array.isArray(products) || !products.length) {
        throw new HttpError('Products array not valid', HTTP_STATUS.BAD_REQUEST);
      }
      
      const productsMap = products.reduce((productsMap, currentProduct) => {
        productsMap[currentProduct.reference] = currentProduct.quantity;
        return productsMap;
      }, {});

      const productsIds = Object.keys(productsMap);
      const productsFilter = { _id: { $in: productsIds }};
      const productsDB = await productsDao.getproducts(productsFilter);
      
      if (!productsDB || !productsDB.length) {
        throw new HttpError('Please check products list', HTTP_STATUS.BAD_REQUEST);       
      }

      let totalPrice = 0;
      const productsPayload = productsDB.map(product => {
        const reference = product._id;
        const quantity = productsMap[reference];
        const price = product.price;
        totalPrice += price * quantity;
        return {
          reference,
          quantity,
          price,
        }
      });

      const order_number = Date.now();
      const newTicketPayload = {
        order_number,
        cart,
        user,
        status: 'pending',
        products: [],
        total_price: 0,
      };

      const newTicket = await ticketsDao.createTicket(newTicketPayload);
      return newTicket;
    }

    async resolveTicket(id, resolution) {
      if (!id || !resolution) {
        throw new HttpError('Missing param', HTTP_STATUS.BAD_REQUEST);
      }

      if (resolution !== 'completed' && resolution !== 'rejected') {
        throw new HttpError('Wrong value for `resolution` param', HTTP_STATUS.BAD_REQUEST);
      }

      const order = await ticketsDao.getTicketById(id);
      if (!order) {
        throw new HttpError('Ticket not found', HTTP_STATUS.NOT_FOUND);
      }

      order.status = resolution;
      await ticketsDao.updateTicket(id, order);
      return order;
    }
}
