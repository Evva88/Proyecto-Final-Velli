import fs from "fs";

class ProductManager {
  constructor() {
    this.products = [];
    this.path = "Productos.json";
    this.loadProducts();
  }

  // Valida que los campos requeridos tengan un valor

  validateRequiredFields(fields) {
    for (const field of fields) {
      if (!field.value) {
        throw new Error(`${field.name} es requerido`);
      }
    }
  }

  getProducts = async () => {
    const data = await fs.promises.readFile(this.path, "utf-8");
    this.products = JSON.parse(data);
    return this.products;
  };

  // Obtiene un nuevo ID para el producto

  getId() {
    let max = 0;
    this.products.forEach((item) => {
      if (item.id > max) {
        max = item.id;
      }
    });
    return max + 1;
  }

  async loadProducts() {
    try {
      const data = await fs.promises.readFile(this.path, "utf-8");
      this.products = JSON.parse(data);
    } catch (error) {
      console.error("Error al cargar los productos:", error.message);
      this.products = [];
    }
  }

  // Agrega un nuevo producto a la lista de productos

  async addProduct(newProduct) {
    const fields = [
      { name: "title", value: newProduct.title },
      { name: "description", value: newProduct.description },
      { name: "price", value: newProduct.price },
      { name: "code", value: newProduct.code },
      { name: "stock", value: newProduct.stock },
      { name: "category", value: newProduct.category },
    ];
  
    try {
      this.validateRequiredFields(fields);
    } catch (error) {
      console.error("Error de validación:", error.message);
      throw error;
    }
  
    const productExists = this.products.find(
      (product) => product.code === newProduct.code
    );
  
    if (productExists) {
      console.error("El código ya existe", productExists.code);
      throw new Error("El código del producto ya existe");
    }
  
    const id = this.getId();
  
    if (newProduct.status === undefined) {
      newProduct.status = true;
    }
  
    const product = {
      title: newProduct.title,
      description: newProduct.description,
      price: newProduct.price,
      thumbnail: `https://picsum.photos/200/300?random=${id}`,
      code: newProduct.code,
      stock: newProduct.stock,
      category: newProduct.category,
      status: newProduct.status,
      id: id,
    };
  
    this.products.push(product);
    await this.saveProducts();
    console.log("Producto agregado", product);
  
    // Devuelve el producto recién agregado
    return product;
  }
  // Obtiene productos por su ID
  async getProductsById(id) {
    try {
      const data = await fs.promises.readFile(this.path, "utf-8");
      this.products = JSON.parse(data);

      const existentProduct = this.products.find((prod) => prod.id === id);

      if (!existentProduct) {
        console.log(
          `Not Found: El producto con el id ${id} no existe en nuestra base de datos`
        );
      } else {
        console.log(
          `El producto con el id ${id} fue encontrado en nuestra base de datos`
        );
        return existentProduct;
      }
    } catch (error) {
      console.log(error);
    }
  }

  // Elimina un producto por su ID
  async deleteProduct(id) {
    const productIndex = this.products.findIndex(product => product.id === id);
    if (productIndex !== -1) {
      const deletedProduct = this.products[productIndex];
      this.products.splice(productIndex, 1);
    
      // Guardar los cambios en el archivo JSON
      await this.saveProducts();
    
      return deletedProduct;
    }
    else {
      // Producto no encontrado
      console.log("No se encontró ningún producto con ese ID", id);
      return null;
    }
  }
  //modifica el producto por su ID

  async updateProduct(id, updatedFields) {
    const data = await fs.promises.readFile(this.path, "utf-8");
    this.products = JSON.parse(data);

    const productIndex = this.products.findIndex(
      (product) => product.id === id
    );

    if (productIndex > -1) {
      Object.assign(this.products[productIndex], updatedFields);
      this.saveProducts();
      console.log("Producto actualizado", this.products[productIndex]);
    } else {
      console.log("No se encontró ningún producto con ese ID", id);
      throw new Error("Producto no encontrado");
    }
  }

  async saveProducts() {
    await fs.promises.writeFile(
      this.path,
      JSON.stringify(this.products, null, 2)
    );
  }
}

export default ProductManager;
