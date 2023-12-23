import { ticketModel } from "../dao/models/ticket.model.js";

class TicketService {
  async createTicket(data) {
    console.log("Datos del ticket antes de crear:", data);

    if (
      !data.code ||
      !data.purchase_datetime ||
      !data.amount ||
      !data.purchaser
    ) {
      console.error("Datos incompletos:", data);
      throw new Error("Datos incompletos para crear el ticket.");
    }

    const ticket = new ticketModel(data);
    await ticket.save();
    console.log("Ticket creado:", ticket);
    return ticket;
  }
  async getTickets() {
    try {
      const tickets = await ticketModel.find();
      return tickets;
    } catch (error) {
      console.log(error);
      throw new Error("Error al obtener los tickets desde el servicio");
    }
  }

  async getTicketByNumber(ticketNumber) {
    try {
      if (!ticketNumber) {
        throw new Error("Número de ticket no proporcionado.");
      }

      const ticket = await ticketModel.findOne({ code: ticketNumber });

      if (!ticket) {
        console.error(`No se encontró el ticket con el número: ${ticketNumber}`);
        throw new Error("Ticket no encontrado.");
      }

      return ticket;
    } catch (error) {
      console.error("Error al buscar el ticket:", error);
      throw error;
    }
  }
}

export default TicketService;

