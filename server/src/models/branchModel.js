import mongoose from 'mongoose';

// Branch Schema
const branchSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      latitude: { type: Number },
      longitude: { type: Number },
    },
    address: {
      type: String,
      required: true,
    },
    deliveryPartners: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DeliveryPartner', // name of the user model are same as the name of the model
      },
    ],
  },
  { timestamps: true },
);

// Export Branch Model
const Branch = mongoose.model('Branch', branchSchema); // name of the model is Branch and the schema is branchSchema
export default Branch;