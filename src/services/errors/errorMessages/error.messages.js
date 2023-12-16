export const updateQuantityInCartError = (cart, productId) =>{
    return `Una o varias propiedades fueron enviadas incompletas o son invalidas.
            Propiedades requeridas:
            * ID de carrito: type String, recibido: ${cart}
            * ID de producto: type String, recibido: ${productId}`;
};

export const createProductError = (product) => {
    return `Una o varias propiedades fueron enviadas incompletas o son invalidas.
            Propiedades requeridas: 
            * title: type String, recibido: ${product.title}
            * description: type String, recibido: ${product.description}
            * code: type String, recibido: ${product.code}
            * price: type String, recibido: ${product.price}
            * stock: type String, recibido: ${product.stock}
            * category: type String, recibido: ${product.category}`;
};

export class generateError {
    static getId(id){
        return `El ID recibido fue ${id} y no es valido `;
    }
    static idNorFound(){
        return 'El ID no existe';
    }
    static getEmptyDB(){
        return 'Data: {}';
    }
    static unauthorized(){
        return 'Usuario no autorizado';
    }
    static DBNotChanged(){
        return 'La base de datos no registro el cambio';
    }
}

