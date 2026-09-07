import mongoose from "mongoose";

const CouponSchema = new mongoose.Schema({
code:{
    type:String,
    required:[true,"Coupon code is required"],
    unique:true,
    uppercase:true,
    trim:true,
},
discount:{
    type:Number,
    required:[true,"Coupon discount is required"],
    min:[0,"Discount cannot be negative"]
},
expires:{
    type:Date,
    required:[true,"Coupon expiration date is required"]
}
},
{
    timestamps:true
}

)

export const CouponModel = mongoose.model("Coupon",CouponSchema);