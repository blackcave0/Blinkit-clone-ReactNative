import 'dotenv/config.js'
import { Product, Category } from "./src/models/indexModels.js";
import mongoose from "mongoose";
import { categories, products } from './seedData.js';

async function seedDatebse(){
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Product.deleteMany({})
    await Category.deleteMany({})

    const categoryDocs = await Category.insertMany(categories)
    const categoryMap = categoryDocs.reduce((map, category) => {
      map[category.name] = category._id;
      return map;
    },{});

    const productWithCatgoryIds = products.map((product)=> ({
      ...product,
      category: categoryMap[product.category]
    }));

    await Product.insertMany(productWithCatgoryIds);
    console.log('Database seeded successfully');
  } catch (error) {
    console.log(error);
  }finally {
    mongoose.connection.close();
    process.exit(0);
  }
}

seedDatebse();