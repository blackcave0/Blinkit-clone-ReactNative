import AdminJS from 'adminjs';
import AdminJsFastify from '@adminjs/fastify';
import * as AdminJSMongoose from '@adminjs/mongoose';
import * as Models from '../models/indexModels.js'; // Import models
import { authenticate, COOKIE_PASSWORD, sessionStore } from './config.js';
import { dark, light, noSidebar } from '@adminjs/themes';

// import { Customer, Admin , DeliveryPartner } from "../models/userModel.js";
// import Branch from "../models/branchModel.js";

AdminJS.registerAdapter(AdminJSMongoose);

export const admin = new AdminJS({
  resources: [
    {
      resource: Models.Customer,
      options: {
        listProperties: ['phone', 'role', 'isActivated'],
        filterProperties: ['phone', 'role'],
      },
    },
    {
      resource: Models.DeliveryPartner,
      options: {
        listProperties: ['email', 'role', 'isActivated'],
        filterProperties: ['email', 'role'],
      },
    },
    {
      resource: Models.Admin,
      options: {
        listProperties: ['email', 'role', 'isActivated'],
        filterProperties: ['email', 'role'],
      },
    },
    { resource: Models.Branch },
    { resource: Models.Category },
    { resource: Models.Product },
    { resource: Models.Order },
    { resource: Models.Counter },
    
  ],

  branding: {
    companyName: 'Blinkit',
    withMadeWithLove: false,
    favicon:
      'https://res.cloudinary.com/do1sonzbq/image/upload/v1732318409/blinkit/ex73ns2hakfdgycb9u3e.jpg',
    logo: 'https://res.cloudinary.com/do1sonzbq/image/upload/v1732318409/blinkit/ex73ns2hakfdgycb9u3e.jpg',
  },
  defaultTheme: dark.id,
  availableThemes: [dark, light, noSidebar],

  rootPath: '/admin',
});

// Export admin
// console.log(admin.resources)

export const buildAdminRouter = async (app) => {
  await AdminJsFastify.buildAuthenticatedRouter(
    admin,
    {
      authenticate, //::-> from the config.js #module.exports
      cookiePassword: COOKIE_PASSWORD,
      cookieName: 'adminjs',
    },
    app,
    {
      store: sessionStore, //::-> from the config.js #mmodule.exports
      saveUninitialized: true,
      secret: COOKIE_PASSWORD,
      cookie: {
        // httpOnly: process.env.NODE_ENV === 'production',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
      },
    },
  );
};
