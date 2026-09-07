import mongoose from "mongoose";

const SubCategorySchema  =new mongoose.Schema({
name:{
    type:String,
    required:[true,"Subcategory name is required"],
    unique:true,
    trim:true,
    minlength:[2,"Too short Subcategory name"],
    maxlength:[50,"Too long Subcategory name"]
},
slug:{
    type:String,
    required:true,
    unique:true,
    trim:true,
    lowercase:true,
},
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required:[true,"Subcategory must belong to a parent category"]
    },
image:{
    url:{
        type:String,
        required:[true,"Subcategory image is required"]
    },
    public_id:{
        type:String,
        required:[true,"Subcategory publicID is required"]
    }
}
},
{
    timestamps:true
}
)

export const SubcategoryModel = mongoose.model("SubCategory",SubCategorySchema);