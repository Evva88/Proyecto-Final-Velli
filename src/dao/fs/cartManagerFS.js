import fs from "fs";

class CartManager {
    constructor() {
        this.carts = [];
    }

    newCart() {
        this.carts.push({id:this.generateId(), products:[]});
        this.saveCart();
        console.log("Cart created!");

        return true;
    }

    getCart(id) {
        this.carts = JSON.parse(fs.readFileSync(this.path, "utf-8"));

        return this.carts.find(item => item.id === id);
    }

    getCarts() {
        let carts = JSON.parse(fs.readFileSync(this.path, "utf-8"));

        return carts;
    }

    generateId() {
        let max = 0;
        let carts = this.getCarts();

        carts.forEach(item => {
            if (item.id > max) {
                max = item.id;
            }
        });

        return max+1;
    }

    saveCart() {
        fs.writeFileSync(this.path, JSON.stringify(this.carts));
    }

    addProductToCart(cid, pid) {
        this.carts = this.getCarts();
        const cart = this.carts.find(item => item.id === cid);
        let product = cart.products.find(item => item.product === pid);

        if (product) {
            product.quantity+= 1;
        } else {
            cart.products.push({product:pid, quantity:1});
        }

        this.saveCart();
        console.log("Product added!");

        return true;
    }    
}

export default CartManager;