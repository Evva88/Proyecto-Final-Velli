export const generateUserError= (user)=>{
    return `Un dato o varios fueron ingresados de mala manera o estan en faltante.
            Datos requeridos:
                * first_name: type String, recibido: ${user.first_name}
                * last_name: type String, recibido: ${user.last_name}
                * email: type String, recibido: ${user.email}
                * age: type Number, recibido: ${user.age}
                * password: type String, recibido: ${user.password}`;
};