import Contacts from "../dao/factory.js";
console.log(Contacts);
import ContactsRepo from "./contacts.repository.js";

export const ContactsService = new ContactsRepo(new Contacts());