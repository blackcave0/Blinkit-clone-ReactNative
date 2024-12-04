import { confirmOrder, createOrder, getOrderById, getOrders, updateOrderStatus } from "../controllers/order/orderHandler.js";
import { verifyToken } from "../middleware/auth.js"


export const orderRoutes = async (fastify, options ) => {
  fastify.addHook("preHandler", async (req, reply)=> {
    const isAuthenticated = await verifyToken(req, reply)
    if(!isAuthenticated){
      return reply.code(401).send({
        success : false,
        message : "Unauthorized"
      })
    }
  });

  fastify.post('/create-order', createOrder);
  fastify.get('/order', getOrders);
  fastify.patch('/order/:orderId/update-status', updateOrderStatus);
  fastify.post('/order/:orderId/confirm', confirmOrder);
  fastify.post('/order/:orderId', getOrderById);
  

}