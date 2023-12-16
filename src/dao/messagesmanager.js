import messageModel from "./models/message.model.js"

export default class MessagesManager {
    //Consigue los mensajes
    getMessages = async () => {
      try {
        return await messageModel.find().lean().exec();
      } catch (error) {
        return error;
      }
    }
    //Crea los mensajes segun el modelo
    createMessage = async (message) => {
      if (message.user.trim() === '' || message.message.trim() === ''){
        return null;
      }
      try {
        return await messageModel.create(message);
      } catch (error) {
        return error;
      }
    }
    //Borra todos los mensajes
    deleteAllMessages = async() =>{
      try{
         console.log("Borrando todos los mensajes...");
         const result = await messageModel.deleteMany({});
         console.log("Mensajes borrados" + result);
         return result;
      }catch(error){
         return error;
      }
    }
  }