import { userModel } from "../dao/models/user.model.github.js";

class ContactsMDB {
  constructor() {}

  get = async () => {
    let contacts = await userModel.find();
    return contacts;
  };
  insert = async (first_name, last_name, email, password, phone) => {
    let contact = { first_name, last_name, email, password, phone };
    await userModel.create(contact);
  };
  update = async (email, contact) => {
    return await userModel.updateOne(
      { email: email },
      {
        name: contact.name,
        email: contact.email,
        password: contact.password,
        phone: contact.phone,
      }
    );
  };
  delete = async (email) => {
    await userModel.deleteOne({ email: email });
    return await userModel.find();
  };
}

export default ContactsMDB;
