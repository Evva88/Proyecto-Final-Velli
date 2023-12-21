import chai from "chai";
import supertest from "supertest";
import mongoose from "mongoose";
import { generateMockProduct } from "../moking/utils.mocking.js";

const expect = chai.expect;
const requester = supertest("http://localhost:8080");

describe("Test Tu Previa app", () => {
  let globalCookie = null;

  describe("Test de integracion de ecommerce", () => {
    before(async function () {
      this.mockUser = {
        first_name: "Admin",
        last_name: "Apellido",
        email: "adminCoder@coder.com",
        age: 30,
        password: "adminCod3r123",
        role: "admin",
        cart: "123Abc",
      };
    });

    describe("Test de sesion de api", () => {
      it("Registrar usuario - POST /api/sessions/register", async function () {
        const registerResponse = await requester
          .post("/api/sessions/register")
          .send(this.mockUser);
        expect(registerResponse.statusCode).to.equal(200);
      });
      it("Debería hacer el login del usuario y setearle la cookie - POST /api/sessions/login", async function () {
        const loginResponse = await requester.post("/api/sessions/login").send({
          email: this.mockUser.email,
          password: this.mockUser.password,
        });
        expect(loginResponse.statusCode).to.equal(200);
        globalCookie = loginResponse.headers["set-cookie"][0].split(";")[0];
        console.log("Cookie despues del login:", globalCookie);
      });
    });
  });

  describe("Api test para productos", () => {
    describe("Testing de las rutas de productos", () => {
      it("El metodo GET trae todos los productos del array - GET /api/products", async () => {
        const response = await requester.get("/api/products");
        const { statusCode, ok, _body } = response;
        expect(statusCode).to.be.eql(200);
        expect(ok).to.be.true;
        expect(_body.payload).to.be.an("array");
      });
      it("Obtengo un producto (ejemplo) por su ID - GET /api/products/652b29ce8b1c2751a6e223bf", async function () {
        console.log("Using cookie in request:", globalCookie);

        const productMock = generateMockProduct();
        const createProductResponse = await requester
          .post("/api/products")
          .set("Cookie", globalCookie)
          .send(productMock);

        expect(createProductResponse.statusCode).to.equal(200);
        console.log(
          "Body antes de crear el producto: ",
          createProductResponse.body
        );
        const productId = createProductResponse.body.productId;
        console.log("ID de producto: ", productId);
        const getProductResponse = await requester
          .get(`/api/products/${productId}`)
          .set("Cookie", globalCookie);
        const { statusCode, ok, body } = getProductResponse;
        console.log("Body: ", body);

        expect(body.data).to.be.an("object");
        expect(body.data).to.have.property("_id", productId);
      });
    });
    describe("El usuario esta loggeado y tiene un rol", () => {
      it("Deberia crear un producto si estas loggeado y tu rol lo permite - POST /api/products/", async function () {
        console.log("Usando cookie: ", globalCookie);
        const productMock = generateMockProduct();
        const createProductResponse = await requester
          .post("/api/products")
          .set("Cookie", globalCookie)
          .send(productMock);
        expect(createProductResponse.statusCode).to.be.eql(200);
        expect(createProductResponse.body).to.be.an("object");
      });
    });
    describe("Usuario no loggeado", () => {
      it("Si se quiere crear un producto sin estar loggeado, deberia retornar un status 401 - POST /api/products", async function () {
        const productMock = generateMockProduct();
        const { statusCode, ok } = await requester
          .post("/api/products")
          .send(productMock);
        expect(ok).to.be.not.ok;
        expect(statusCode).to.be.eql(401);
      });
    });
  });

  describe("Testeo para las rutas de carts", () => {
    let createdCartId;

    it("Crea un cart con el metodo POST", async () => {
      const cartResponse = await requester.post("/api/carts");

      expect(cartResponse.statusCode).to.be.eql(201);

      expect(cartResponse.body).to.be.an("object");
      createdCartId = cartResponse.body.payload.id;
    });

    it("Obtengo un cart por su ID - GET /api/carts/:cartId", async () => {
      const getCartResponse = await requester.get(
        `/api/carts/${createdCartId}`
      );
      expect(getCartResponse.statusCode).to.be.eql(200);
      expect(getCartResponse.body).to.be.an("object");
    });
  });
});
