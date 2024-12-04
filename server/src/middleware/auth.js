import jwt from 'jsonwebtoken';
import 'dotenv/config.js'
export const verifyToken = async (req, reply) => {
  try {
    // const authHeader = req.headers.authorization;
    const authHeader = req.headers['authorization'];
    console.log(authHeader);
    if(!authHeader || !authHeader.startsWith('Bearer ')) {
      return reply.status(401).send({
        success : false,
        status: 'error',
        message: 'Unauthorized',
      })
    }
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // console.log(decoded.userId);
    
    req.user = decoded;
    // console.log(decoded);
    return true;

  } catch (error) {
    return reply.status(403).send({
      success : false,
      status: 'error',
      message: 'Invalid token',
    })
  }
}

