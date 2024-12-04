import mongoose from "mongoose";

const productSchem = mongoose.Schema({
  name : {
    type : String,
    required : true,
  },
  /* description : {
    type : String,
    required : true,
  }, */
  price : {
    type : Number,
    required : true,
  },
  discountPrice : {
    type : Number,
  },
  quantity : {
    type : String,
    required : true,
  },
  category : {
    type : mongoose.Schema.Types.ObjectId,
    required : true,
    ref : 'Category',
  }
});

export const Product = mongoose.model('Product', productSchem);