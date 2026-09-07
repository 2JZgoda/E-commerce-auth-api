import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema({
text:{
    type:String,
    required:[true,"Review text is required"],

},
rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: 1,
      max: 5,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Review must belong to a product'],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user'],
    },
  },
  { timestamps: true }
);

export const ReviewModel = mongoose.model("Review",ReviewSchema);