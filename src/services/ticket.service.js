import { HttpError, HTTP_STATUS } from "../utils/utils.js";
import { getDAOS } from "../models/daos/indexDAO.js";

const { ticketsDao, productsDao, cartsDao, usersDao } = getDAOS();

export class TicketService {
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

    async createTicket(cart,user,amount) {
      
     if (!cart || !user) {
        throw new HttpError('`cart` and `user` are required fields', HTTP_STATUS.BAD_REQUEST);
      }
      
      const cartDB = await cartsDao.getCartById(cart);
      if (!cartDB) {
        throw new HttpError('Cart not found', HTTP_STATUS.BAD_REQUEST);
      }

      if (!amount) {
        throw new HttpError('amount not valid', HTTP_STATUS.BAD_REQUEST);
      }


      const order_number = Date.now();
      const newTicketPayload = {
        order_number,
        cart,
        purchaser:user,
        status: 'pending',
        amount: amount,
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
