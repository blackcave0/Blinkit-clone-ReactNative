// 1. fetch all categories from the database
import {Category} from '../../models/category.js';

export const getAllCategories = async (req, reply) => {
  try {
    const categories = await Category.find();
    return reply.status(200).send({
      success: true,
      message: 'Categories fetched successfully',
      categories,
    });
  } catch (error) {
    console.log(error)
    return reply.status(500).send({
      success: false,
      message: 'Internal server error from categoryHandler',
    });
  }
}