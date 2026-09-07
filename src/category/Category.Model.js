import mongoose from "mongoose";
const CategorySchema = new mongoose.Schema({
name:{
    type:String,
    required:[true,"Category name is required"],
    unique:true,
    trim:true,
    minlength:[2,"Too short category name"],
    maxlength:[59,"Too long category name"]
},
slug:{
    type:String,
    required:true,
    unique:true,
    trim:true,
    lowercase:true,
},
image: {
      url: {
        type: String,
        required: [true, "Category image URL is required"],
      },
      public_id: {
        type: String,
        required: [true, "Category image public_id is required"],
      },
    },
},
{
    timestamps:true,
}

)

export const CategoryModel = mongoose.model("Category",CategorySchema);
