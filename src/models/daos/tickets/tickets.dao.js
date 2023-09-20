import ticketsModel from "../../schemas/ticket.schema.js"

export class TicketsDAO {
  async getTickets() {
    const tickets = await ticketsModel.find().lean();
    return tickets;
  }

  async getTicketById(id) {
    const ticket = await ticketsModel.findOne({ _id: id }).lean();
    return ticket;
  }

  async createTicket(payload) {
    const newTicket = await ticketsModel.create(payload);
    return newTicket;
  }

  async updateTicket(id, payload) {
    const updatedTicket = await ticketsModel.updateOne({ _id: id }, {
      $set: payload
    });
    return updatedTicket;
  }
}