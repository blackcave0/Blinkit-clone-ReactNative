import mongoose from 'mongoose';

// Base User Schema
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      // required: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ['user', 'admin', 'DeliveryPartner'],
      required: true,
    },
    isActivated: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

// Customer Schema
const customerSchema = new mongoose.Schema(
  {
    ...userSchema.obj,
    phone: {
      type: Number,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      enum: ['Customer'],
      default: 'Customer',
    },

    liveLocation: {
      latitude: { type: Number },
      longitude: { type: Number },
    },
    address: {
      type: String,
      // required: true,
    },
  },
  { timestamps: true },
);

// Delivery Partner Schema
const deliveryPartnerSchema = new mongoose.Schema(
  {
    ...userSchema.obj,
    email: { type: String, required: true },
    password: { type: String, required: true },
    phone: {
      type: Number,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      enum: ['DeliveryPartner'],
      default: 'DeliveryPartner',
    },

    liveLocation: {
      latitude: { type: Number },
      longitude: { type: Number },
    },
    address: {
      type: String,
      required: true,
    },

    // Branch for your nearby branch of store
    branch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Branch',
    },
  },
  { timestamps: true },
);

// Admin Schema
const adminSchema = new mongoose.Schema(
  {
    ...userSchema.obj,
    email: { type: String, required: true },
    password: { type: String, required: true },

    role: {
      type: String,
      enum: ['admin'],
      default: 'admin',
    },
  },
  { timestamps: true },
);

// Export models
export const Customer = mongoose.model('Customer', customerSchema);
export const DeliveryPartner = mongoose.model('DeliveryPartner', deliveryPartnerSchema);
export const Admin = mongoose.model('Admin', adminSchema);
