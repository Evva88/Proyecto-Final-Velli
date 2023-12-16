import UserDto from "../dao/dtos/user.dto";
import UserResponse from "../dao/dtos/user.response";

class ContactsRepo {
    constructor(dao){
        this.dao = dao;
    }
   
    createContact = async (user)=>{
        const newContact =  new UserDto(user);
        const userDao =  await this.dao.insert(newContact);
        const isUser = new UserResponse(userDao);
        return isUser;
    }
}
export default ContactsRepo;