import TicketService from "../services/tickets.service.js";

class TicketController {
  constructor() {
    this.ticketService = new TicketService();
  }

  async createTicket(req) {
    try {

        const data = req.body;
        const ticket = await this.ticketService.createTicket(data);

        if (ticket) {
            return ticket;  
        } else {
            throw new Error("Error al crear el ticket");
        }
    } catch (error) {
        req.logger.error('Error específico en la creación del ticket:', error);
        throw error;  
    }
}

}

export default new TicketController();