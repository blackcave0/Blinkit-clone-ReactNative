import { Customer, DeliveryPartner } from '../../models/indexModels.js';
import jwt from 'jsonwebtoken';

//:: TODO: isActived is false dont allow login....
const generateToken = (user) => {
  const accessToken = jwt.sign(
    {
      userId: user._id,
      role: user.role,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: '1d',
    },
  );

  const refreshToken = jwt.sign(
    {
      userId: user._id,
      role: user.role,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: '7d',
    },
  );

  return { accessToken, refreshToken };
};

export const loginCustomer = async (req, reply) => {
  try {
    const { phone } = req.body;
    let customer = await Customer.findOne({ phone });
    if (!customer) {
      customer = new Customer({ phone, role: 'Customer', isActived: true });
      await customer.save();
    }
    
    const { accessToken, refreshToken } = generateToken(customer);

    return reply.status(200).send({
      success: true,
      message: customer ? 'Login successful' : 'Customer created successfully',
      accessToken,
      refreshToken,
      customer,
    });
  } catch (error) {
    console.log(error);
    return reply
      .status(500)
      .send({ success: false, message: 'Internal server error' });
  }
};

/**
 * Logs in a delivery partner by verifying their email and password.
 * If the delivery partner is not found, it returns a 404 Not Found response.
 * If the password is invalid, it returns a 401 Unauthorized response.
 * Otherwise, it generates an access token and a refresh token, and returns a 200 OK response with the new tokens and the delivery partner data.
 *
 * @param {Object} req - The request object.
 * @param {Object} reply - The reply object.
 * @returns {Promise<Object>} - The new access and refresh tokens, or an error response.
 */
export const loginDeliveryPartner = async (req, reply) => {
  try {
    const { email, password } = req.body;
    const deliveryPartner = await DeliveryPartner.findOne({ email });
    if (!deliveryPartner) {
      return reply.status(404).send({
        success: false,
        message: 'Delivery Partner not found',
      });
    }

    if (deliveryPartner.password !== password) {
      return reply.status(401).send({
        success: false,
        message: 'Invalid Credentials',
      });
    }

    const { accessToken, refreshToken } = generateToken(deliveryPartner);

    return reply.status(200).send({
      success: true,
      message: 'Login Successful',
      // data: {
        accessToken,
        refreshToken,
        deliveryPartner,
      // },
    });
  } catch (error) {
    console.log(error);
    return reply.status(500).send({
      success: false,
      message: 'Internal server error',
    });
  }
};

/**
 * Refreshes the access token using the provided refresh token.
 * If the refresh token is not provided, it returns a 401 Unauthorized response.
 * If the refresh token is invalid, it returns a 401 Unauthorized response.
 * If the user associated with the refresh token is not found, it returns a 401 Unauthorized response.
 * Otherwise, it generates a new access token and refresh token, and returns a 200 OK response with the new tokens.
 *
 * @param {Object} req - The request object.
 * @param {Object} reply - The reply object.
 * @returns {Promise<Object>} - The new access and refresh tokens, or an error response.
 */
export const refreshToken = async (req, reply) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return reply.status(401).send({
      success: false,
      message: 'Refresh token is required',
    });
  }
  try {
    // Verify the refresh token
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    // Find the user associated with the refresh token
    let user;

    // Check if user is a customer or delivery partner
    if (decoded.role === 'Customer') {
      user = await Customer.findById(decoded.userId);
    } else if (decoded.role === 'DeliveryPartner') {
      user = await DeliveryPartner.findById(decoded.userId);
    } else {
      return reply.status(401).send({
        success: false,
        message: 'Invalid token',
      });
    }

    // Check if user exists
    if (!user) {
      return reply
        .status(401)
        .send({ success: false, message: 'Invalid refresh token' });
    }

    // Generate new access token
    const { accessToken, refreshToken: newRefreshToken } = generateToken(user);
    if (user) {
      return reply.status(200).send({
        success: true,
        message: 'Token refreshed successfully',
        accessToken,
        refreshToken: newRefreshToken,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

/**
 * Fetches the user based on the userId and role in the request.
 * If the user is a customer, it fetches the customer from the Customer model.
 * If the user is a delivery partner, it fetches the delivery partner from the DeliveryPartner model.
 * If the token is invalid, it returns a 401 Unauthorized response.
 * If the user is not found, it returns a 404 Not Found response.
 * Otherwise, it returns a 200 OK response with the user data.
 *
 * @param {Object} req - The request object.
 * @param {Object} reply - The reply object.
 * @returns {Promise<Object>} - The user data or an error response.
 */
export const fetchUser = async (req, reply) => {
  try {
    const { userId, role } = req.user;
    // console.log("Decoded user:", { userId, role });
    let user;


    if (role === 'Customer') {
      user = await Customer.findById(userId);
    } else if (role === 'DeliveryPartner') {
      user = await DeliveryPartner.findById(userId)
      .select('-password');
    } else {
      return reply.status(401).send({
        success: false,
        message: 'Invalid token of user',
      });
    }
    console.log("Fetched user:", user);
    if (!user) {
      return reply.status(404).send({
        success: false,
        message: 'User not found',
      });
    }

      return reply.status(200).send({
        success: true,
        message: 'User fetched successfully',
        user,
      });
  } catch (error) {
    console.log(error);
    return reply.status(500).send({
      success: false,
      message: 'Internal server error',
    });
  }
};
