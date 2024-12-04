import { updateUserProfile } from "../controllers/tracking/userDpLocation.js";
import { fetchUser, loginCustomer, loginDeliveryPartner, refreshToken } from "../controllers/authControll/authController.js";
import { verifyToken } from "../middleware/auth.js";


export const authRoutes = async(fastify, options) => {
  // public routes
  fastify.post('/customer/login', loginCustomer);
  fastify.post('/delivery/login', loginDeliveryPartner);
  fastify.post('/refresh-token', refreshToken);

  // private routes
  fastify.get('/user',{preHandler : verifyToken}, fetchUser);
  fastify.patch('/update',{preHandler : verifyToken}, updateUserProfile);
}