import { getAllCategories } from "../controllers/productHandler/categoryHandler.js";
import { getProductByCategoryId } from "../controllers/productHandler/productHandler.js";

export const productRoutes = async(fastify, options) => {
  fastify.get('/categories', getAllCategories);
  fastify.get('/products/:categoryId', getProductByCategoryId);
}