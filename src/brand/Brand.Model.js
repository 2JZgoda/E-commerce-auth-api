import mongoose from "mongoose";

const BrandSchema = new mongoose.Schema({
name:{
    type:String,
    required:[true,"Brand name is required"],
    unique:true,
    trim:true,
    minlength:[2,"Too short Brand name"],
    maxlength:[50,"Too long Brand name"],
},
slug:{
    type:String,
    required:true,
    unique:true,
    trim:true,
},
image:{
      url: {
        type: String,
        required: [true, "Category image URL is required"],
      },
      public_id: {
        type: String,
        required: [true, "Category image public_id is required"],
      },
    },
}
,

{
    timestamps:true,
}

)


export const BrandModel = mongoose.model("Brand",BrandSchema);