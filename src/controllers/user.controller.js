import UserService from "../services/user.service.js";
import UserResponse from "../dao/dtos/user.response.js";
import { generateUserError } from "../services/errors/errorMessages/user.creation.error.js";
import EErrors from "../services/errors/errorsEnum.js";
import CustomeError from "../services/errors/customeError.js";
import { createHash } from "../midsIngreso/bcrypt.js";
import { userModel } from "../dao/models/user.model.js";

class UserController {
  constructor() {
    this.userService = new UserService();
  }

  async register(req, res, next) {
    try {
      const { first_name, last_name, email, age, password, role } = req.body;
    if( !first_name || !email || !age || !password){
      const customeError = new CustomeError({
        name: "User creation error",
        cause: generateUserError({
          first_name, last_name, age, email,  password, role,
        }),
        message: "Error al intentar registrar al usuario",
        code:400,
      });
      throw (customeError);
    }
    const response = await this.userService.registerUser({
      first_name,
      last_name,
      email,
      age,
      password,
      role,
    });

    return res.status(200).json({
      status: response.status,
      data: response.user,
      redirect: response.redirect,
    });
    } catch (error) {
      if (error instanceof CustomeError){
        return res.status(error.code).json({
          status: 'error',
          message: error.message,
        })
      } else {
        console.log(error);
        return res.status(500).json({
          status: 'error',
          message: 'Error interno',
        })
      }
    } 
  }
  
  async restorePassword(req, res, next) {
    
    try {
      const { user, pass } = req.query;
      const passwordRestored = await this.userService.restorePassword(user, createHash(pass));
      if (passwordRestored) {
        return res.send({status: "OK", message: "La contraseña se ha actualizado correctamente"});
      } else {
        const customeError = new CustomeError({
          name: "Restore Error",
          massage: "No fue posible actualizar la contraseña",
          code: EErrors.PASSWORD_RESTORATION_ERROR,
        });
        return next(customeError);  
      }
    } catch (error) {
      req.logger.error(error);
      return next(error);
    }
  }

  currentUser(req, res, next) {
    if (req.session.user) {
      return res.send({
        status: "OK",
        payload: new UserResponse(req.session.user),
      });
    } else {
      const customeError = new CustomeError({
        name: "Auth Error",
        massage: "No fue posible acceder a Current",
        code: EErrors.AUTHORIZATION_ERROR,
      });
      return next(customeError);  
    }
  }

  

  async uploadFiles (req, res){
    try{
      const userId = req.params.uid;
      const files = req.files;
      const userUpdate = {};
      if(files.profiles){
        userUpdate.profileImage = files.profiles[0].path;
      }
      if(files.products){
        userUpdate.productImage = files.products[0].path;
      }

      if(files.document){
        userUpdate.documents = files.document.map((doc) => ({
          name: doc.originalname,
          reference: doc.path,
          status: "Uploaded",
        }));
      }
      await userModel.findByIdAndUpdate(userId, userUpdate);
      res.status(200).send("Subido con exito")
    } catch(error) {
      res.status(500).send(error.message)
    }
   
  }
  async updateUserDocuments(req, res){
    try {
      const userId = req.params.uid;
      const file = req.file;
      if(!file){
        return res.status(400).send("No se subio nada")
      }
      const document = {
        name: file.originalname,
        string: file.path,
      }
      await userModel.findByIdAndUpdate(userId, {
        $push:{documents:document},
        $set:{last_connection: new Date()},
      });
      res.status(200).send("Documentos subidos con exito")
    } catch (error) {
      res.status(500).send(error.message)
    }
  }
  
  async upgradeToPremium (req, res){
    try {
      const userId = req.params.uid;
      const user = await userModel.findById(userId);
      if(!user){
        return res.status(404).send("Usuario no encontrado")
      }
      const requieredDocs = [
        "identificationDocument",
        "domicileProofDocument",
        "accountStatementDocument",
      ];
      const hasAllDocuments = requieredDocs.every((docName)=> user.documents.some(
        (doc) => doc.name === docName && doc.status === "Uploaded"
      ))
      if(hasAllDocuments){
        user.isPremium = true;
        user.role = "premium";
        await user.save();
        res.status(200).send("Actualizado a Premium")
      } else {
        res.status(400).send("Los documentos requeridos estan incompletos")
      }
    } catch (error) {
      console.error(error);
      res.status(500).send("Error interno")
    }
  }

  async uploadPremiumDocuments(req, res){
    try {
      const userId = req.params.uid;
      const files = req.files;
      const user = await userModel.findById(userId);
      if(!user){
        return res.status(404).send("Usuario no encontrado")
      }
      const updateOrAddDocs = (docName, file) => {
        const existingDocIndex = user.documents.findIndex((doc)=>doc.name === docName);
        const documentData = {
          name: docName,
          reference: file.path,
          status: "Uploaded",
        }
        if(existingDocIndex >= 0){
          user.documents[existingDocIndex]=documentData;
        } else {
          user.documents.push(documentData);
        }
      }
      if(files.identificationDocument){
        updateOrAddDocs("identificationDocument", files.identificationDocument[0]);
      }
      if(files.domicileProofDocument){
        updateOrAddDocs("domicileProofDocument", files.domicileProofDocument[0]);
      }
      if(files.accountStatementDocument){
        updateOrAddDocs("accountStatementDocument", files.accountStatementDocument[0]);
      }
      await user.save();
      res.status(200).send("Documentacion premium cargada correctamente");

    } catch (error) {
      console.error(error);
      res.status(500).send("Error interno");
    }
  }
}

export default UserController;
