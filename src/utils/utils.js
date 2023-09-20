
import bcrypt, { genSaltSync } from "bcrypt"
import { faker } from "@faker-js/faker";

faker.seed = 'es';

export const generateProduct = () => {
  return {
    _id: faker.database.mongodbObjectId(),
    title: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    code: faker.string.alphanumeric({ length: { min: 10, max: 10 } }),
    price: faker.commerce.price({ min: 100, max: 600 }),
    status: true,
    stock: faker.number.int({ min: 10, max: 100 }),
    category: faker.commerce.department()
  };
};


export const createHash = password => bcrypt.hashSync(password,genSaltSync(10))
export const isValidPassword = (user,password)=> bcrypt.compareSync(password,user.password)


export const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    NOT_FOUND: 404,
    SERVER_ERROR: 500
};
export class HttpError {
    constructor(description, status = 500, details = null) {
        this.description = description;
        this.status = status;
        this.details = details;
    }
}
export const successResponse = (payload) => {
    return {
      success: true,
      payload
    }
  };
  
  export const errorResponse = (description, error = null) => {
    return {
      success: false,
      description,
      details: error
    }
  }

