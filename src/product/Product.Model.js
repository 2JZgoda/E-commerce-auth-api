import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
title:{
    type:String,
    required:[true,"Product title is required"],
    trim:true,
    minlength:[3,"Too short product title"],
    maxlength:[100,"Too long product title"],
},
slug:{
    type:String,
    lowercase:true,
},
description:{
    type:String,
    required:[true,"description is required"],
    minlength:[15,"Too short product description"],
    maxlength:[1000,"Too long product description"]
},
quantity:{
    type:Number,
    required:[true,"Product quantity is required"],
    min:[0,"Quantity cannot be negative"],
},
soldCount:{
    type:Number,
    default:0,
},
price:{
    type:Number,
    required:[true,"Product price is required"],
    min:[0,"Price cannot be negative"]
},
priceAfterDiscount:{
    type:Number,
},
category:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Category",
    required:[true,"Product must belong to a category"]
},
subCategory:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"SubCategory",
},
brand:{
    type: mongoose.Schema.Types.ObjectId,
     required:[true,"Product brand is required"],
    ref:"Brand",
},
ratingAvg:{
    type:Number,
    min: [1, 'Rating must be above or equal to 1.0'],
    max: [5, 'Rating must be below or equal to 5.0'],
    default:1,
},
ratingCount:{
    type:Number,
    default:0,
},
imageCover: {
      url: {
        type: String,
        required: [true, "Product cover image URL is required"],
      },
      public_id: {  
        type: String,
        required: [true, "Product cover image public_id is required"],
      },
    },

images: [
      {
        url: {
          type: String,
          required: [true, "Product image URL is required"],
        },
        public_id: {
          type: String,
          required: [true, "Product image public_id is required"],
        },
      },
    ],
  },

  
  {
    timestamps: true,
  }
);

export const ProductModel = mongoose.model("Product", ProductSchema);