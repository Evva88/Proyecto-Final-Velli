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
        console.error("Ticket no creado correctamente:", ticket);
        throw new Error("Error al crear el ticket");
      }
    } catch (error) {
      console.error("Error específico en la creación del ticket:", error);
      throw error;
    }
  }

  async getTickets(req, res) {
    try {
      const tickets = await this.ticketService.getTickets();

      // Envía los tickets como respuesta
      res.json(tickets);
    } catch (error) {
      console.error("Error al obtener los tickets:", error);
      res.status(500).send("Error interno del servidor");
    }
  }
}

export default new TicketController();
