import { faker } from "@faker-js/faker";

export const generateMockProduct = () => {
    let product = {
        _id: faker.database.mongodbObjectId(),
        code: faker.string.alphanumeric(7),
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: parseInt(faker.string.numeric(3)),
        stock: parseInt(faker.string.numeric(2)),
        category: faker.commerce.department(),
        thumbnail: faker.image.url()
    }
    product.available = product.stock > 0 ? true : false;
    return product;
};