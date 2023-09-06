import { CartsDAO } from "./carts/carts.dao.js";
import { TicketsDAO } from "./tickets/tickets.dao.js";
import { ProductsDAO } from "./products/products.dao.js";
import { UsersDAO } from "./users/users.dao.js";

const usersDao = new UsersDAO();
const ticketsDao = new TicketsDAO();
const cartsDao = new CartsDAO();
const productsDao = new ProductsDAO();

export const getDAOS = () => {
  return {
    usersDao,
    ticketsDao,
    cartsDao,
    productsDao,
  }
}