import { SubcategoryModel } from "./SubCategory.Model.js";
import slugify from "slugify";
import { uploadToCloudinary,deleteFromCloudinary } from "../services/cloudinaryService.js";
export const createSubCategory = async (req, res) => {
 let uploadedImage = null;
  try {
    const { name, category } = req.body;
 
    const ifExist = await SubcategoryModel.findOne({ name });
    if (ifExist) {
      return res.status(409).json({
        success: false,
        message: "SubCategory already exists!",
      });
    }
 
    const {url,public_id} = await uploadToCloudinary(req.file.buffer,"subcategories")

    const slug = slugify(name, { lower: true, strict: true });

    const newSubCategory = await SubcategoryModel.create({
      name,
      slug,
      category,
      image:{
        url:url,
        public_id:public_id
      }
    });

    return res.status(201).json({
      success: true,
      message: "SubCategory added successfully!",
      data: newSubCategory,
    });
  } catch (error) {
    if (uploadedImage?.public_id) {
      await deleteFromCloudinary(uploadedImage.public_id).catch(console.error);
    }
    console.error("Internal Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error!"
        });
  }
};

export const getAllSubCategorys = async (req, res) => {
 
  try {

    const page = Math.max(1,parseInt(req.query.page,10) || 1);
    const limit  = Math.max(1,parseInt(req.query.limit,10) || 10);
    const skip = (page-1) * limit;
                
                
    const allowedSortFields = ["name", "createdAt", "updatedAt"];
                
                
    const sortBy = allowedSortFields.includes(req.query.sortBy) ? req.query.sortBy : "createdAt"
                  
    const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;
                
    const totalSubcategories = await SubcategoryModel.countDocuments();
    const totalPages = Math.ceil(totalSubcategories / limit);
                
    const sortObj = {};
                
    sortObj[sortBy] = sortOrder;



    const subCategories = await SubcategoryModel.find().populate("category" , "-__v").sort(sortObj).skip(skip).limit(limit).lean().select("-__v");

    if (subCategories.length === 0) {
      return res.status(200).json({
        success: true,
        message: "There Is No SubCategories To Fetch",
        data: subCategories,
      });
    }

    return res.status(200).json({
      success: true,
      message: "SubCategories Fetched Successfully!",
      data: subCategories,
    });
  } catch (error) {
    console.error("Internal Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error!"
        });
  }
};

export const deleteSubCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const subCategory = await SubcategoryModel.findById(id);
    if (!subCategory) {
      return res.status(404).json({
        success: false,
        message: "SubCategory not found!",
      });
    }

    if(subCategory.image?.public_id){
      await deleteFromCloudinary(subCategory.image?.public_id);
    }

    const deletedSubCategory = await SubcategoryModel.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "SubCategory Deleted Successfully!",
      data: deletedSubCategory,
    });
  } catch (error) {
    console.error("Internal Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error!"
        });
  }
};

export const getSubCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const subCategory = await SubcategoryModel.findById(id).populate("category");

    if (!subCategory) {
      return res.status(404).json({
        success: false,
        message: "SubCategory not found!",
      });
    }

    return res.status(200).json({
      success: true,
      message: "SubCategory Fetched Successfully!",
      data: subCategory,
    });
  } catch (error) {
    console.error("Internal Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error!"
        });
  }
};

export const getSubCategoryBySubCategorynName = async (req, res) => {
  try {
    const { name } = req.params;
    const slug = slugify(name, { lower: true, strict: true })
    const subCategory = await SubcategoryModel.findOne({
      slug: slug,
    }).populate("category");

    if (!subCategory) {
      return res.status(404).json({
        success: false,
        message: "SubCategory not found!",
      });
    }

    return res.status(200).json({
      success: true,
      message: "SubCategory Fetched Successfully!",
      data: subCategory,
    });
  } catch (error) {
    console.error("Internal Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error!"
        });
  }
};

export const updateSubCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category } = req.body;
    const updatedPayload = {};

    const existingSubcategory = await SubcategoryModel.findById(id)

    if(!existingSubcategory){
      return res.status(404).json({
        success:false,
        message:"subcategory not found!"
      })
    }

    if (name) {
      updatedPayload.name = name;
      updatedPayload.slug = slugify(name, { strict: true, lower: true });
    }

    if (category) {
      updatedPayload.category = category;
    }

    if(req.file){
      const uploadedImage = await uploadToCloudinary(req.file.buffer,"subcategories")
      if(existingSubcategory.image?.public_id){
        await deleteFromCloudinary(existingSubcategory.image.public_id);
      }

      updatedPayload.image = {
        url:uploadedImage.url,
        public_id:uploadedImage.public_id
      }
    }

    const updatedSubCategory = await SubcategoryModel.findByIdAndUpdate(
      id,
      updatedPayload,
      { returnDocument: "after", runValidators: true }
    ).populate("category");

    return res.status(200).json({
      success: true,
      message: "SubCategory updated successfully!",
      data: updatedSubCategory,
    });
  } catch (error) {
    console.error("Internal Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error!"
        });
  }
};
