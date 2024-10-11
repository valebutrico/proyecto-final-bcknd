import { faker } from '@faker-js/faker';

export function generateMockProducts(count = 100) {
  const products = [];
  for (let i = 0; i < count; i++) {
    const product = {
      _id: faker.datatype.uuid(),
      name: faker.commerce.productName(),
      price: faker.commerce.price(),
      description: faker.commerce.productDescription(),
      category: faker.commerce.department(),
      image: faker.image.imageUrl(),
      stock: faker.datatype.number({ min: 1, max: 100 }),
    };
    products.push(product);
  }
  return products;
}
