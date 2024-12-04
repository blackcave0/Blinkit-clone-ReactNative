import { authRoutes } from "./authRoutes.js"
import { orderRoutes } from "./orderRoutes.js"
import { productRoutes } from "./productRoutes.js"

const prefix = '/api'

export const registerRouter = async( fastify) => {
  fastify.register(authRoutes, {prefix : prefix})
  fastify.register(productRoutes, {prefix : prefix})
  fastify.register(orderRoutes, {prefix : prefix})
}