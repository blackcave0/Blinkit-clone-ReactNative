// 1. Initializing the function for user profile update and location change one state to another state

import { Customer, DeliveryPartner } from '../../models/indexModels.js';

export const updateUserProfile = async (req, reply) =>{
  try {
    // Get the user ID from the request object
    const {userId} = req.user;

    // Get the update data from the request body
    const updateData = req.body;
    let user = await Customer.findById(userId) || await DeliveryPartner.findById(userId);
    if(!user){
      return reply.status(404).send({
        success: false,
        message: 'User not found',
      });
    };

    // Define the user model based
    let userModel;

    //  Check the user role and set the user model accordingly
    if(user.role === 'Customer'){
      userModel = Customer;
    }else if(user.role === 'DeliveryPartner'){
      userModel = DeliveryPartner;
    } else{
      return reply.status(404).send({
        success: false,
        message: 'User not found',
      });
    }

    // Update the user profile
    const updatedUser = await userModel.findByIdAndUpdate(userId,
      {
        $set: updateData,
      },
      {
        new: true,
        runValidators: true,
      }
    ).select('-password');

    return reply.status(200).send({
      success: true,
      message: 'User updated successfully',
      user : updatedUser,
    });

  } catch (error) {
    console.log(error);
  }
}