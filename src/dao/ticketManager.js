import { ticketModel } from "./models/ticket.model.js";

export default class TicketManager {
  async getAll() {
    try {
      const tickets = await ticketModel.find();
      return tickets;
    } catch (error) {
      console.log(error);
    }
  }

  async create(obj) {
    try {
      console.log("Informacion disponible para crear nuevo ticket: ", obj);
      if (
        !obj.code ||
        !obj.purchase_datetime ||
        !obj.amount ||
        !obj.purchaser
      ) {
        console.log("Informacion insuficiente: ", obj);
        throw new error("Informacion insuficiente, revisar");
      }
      const newTicket = await ticketModel.create(obj);
      return newTicket;
    } catch (error) {
      console.log(error);
    }
  }
}
