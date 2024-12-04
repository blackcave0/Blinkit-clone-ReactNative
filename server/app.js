import fastify from 'fastify';
import dotenv from 'dotenv';
import morgan from 'morgan';
import colors from 'colors';
import connectDB from './src/config/connect.js';
import { PORT } from './src/config/config.js';
import { admin, buildAdminRouter } from './src/config/setup.js';
import { registerRouter } from './src/routes/index.js';



dotenv.config();

// Connect to the database
connectDB();

const app = fastify();
// const PORT = process.env.PORT || 3000;

// Middleware for logging requests
const morganMiddleware = morgan('dev');
app.addHook('onRequest', async (req, res) => {
  morganMiddleware(req.raw, res.raw, ()=> {})
})

await registerRouter(app);
// Set up the admin router
await buildAdminRouter(app)



app.listen({ port: PORT, },  (err, address) => {
  if (err) {
    console.log(err);
    process.exit(1);
  } else {
    console.log(`Blinkit Server is running on ${address}${admin.options.rootPath}`);
  }
});
