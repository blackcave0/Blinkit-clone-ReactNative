// 1. fetch all products from the database
import {Product} from '../../models/products.js';

export const getProductByCategoryId = async(req, reply) => {
  // get the categoryId from the request params
  const { categoryId } = req.params;
  try {
    // find the products with the given categoryId
    const products = await Product.find({ category: categoryId })
    .select('-category')
    .exec();

    return reply.status(200).send({
      success: true,
      message: 'Products fetched successfully',
      products,
    });
    
  } catch (error) {
    console.log(error);
    return reply.status(500).send({
      success: false,
      message: 'Internal server error from productHandler',
    });
  }
}