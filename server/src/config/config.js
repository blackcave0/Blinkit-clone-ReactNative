import '@adminjs/mongoose'
import 'mongoose'
import dotenv from 'dotenv';
import fastifySession from '@fastify/session';
import ConnectMongoDBSession from 'connect-mongodb-session';
import { Admin } from '../models/indexModels.js'

dotenv.config();

const MongoDBStore = ConnectMongoDBSession(fastifySession);

/**
 * Creates a new MongoDB-based session store for the Fastify session middleware.
 * The session store is configured to use the MongoDB URI specified in the `MONGO_URI` environment variable,
 * and to store session data in the `sessions` collection.
 */
export const sessionStore = new MongoDBStore({
  uri: process.env.MONGO_URI,
  collection: 'sessions',
});

sessionStore.on('error', (error) => {
  console.log('Session Store Error', error);
});

/**
 * Authenticates a user by checking the provided email and password against the Admin model.
 *
 * @param {string} email - The email address of the user to authenticate.
 * @param {string} password - The password of the user to authenticate.
 * @returns {Promise<{ email: string, password: string } | null>} - If the authentication is successful, returns an object with the email and password. Otherwise, returns null.
 */
export const authenticate = async (email, password) => {
  if(email && password) {
    const user = await Admin.findOne({email})
    if(!user) {
      return null;
    } 
    if(user.password === password) {
      return Promise.resolve({ email: email, password: password });
    } else {
      return null;
    }
  }

  return null;
  
  //:: TODO: Testing Purpose 
  /* if (email === 'admin@admin.com' && password === 'admin') {
    return Promise.resolve({ email: email, password: password });
  } else {
    return null;
  } */
};

export const PORT = process.env.PORT || 3000;
export const COOKIE_PASSWORD = process.env.COOKIE_PASSWORD;

// Export the constants and functions
// export { PORT, COOKIE_PASSWORD, authenticate, sessionStore };
