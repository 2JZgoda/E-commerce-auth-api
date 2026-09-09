import { BrandModel } from "./Brand.Model.js";
import slugify from "slugify";
import {uploadToCloudinary,deleteFromCloudinary} from "../services/cloudinaryService.js"

export const createBrand = async (req, res) => {
  try {
    const { name } = req.body;

    const ifExist = await BrandModel.findOne({ name });
    if (ifExist) {
      return res.status(409).json({
        success: false,
        message: "Brand already exists!",
      });
    }

    const {url,public_id} = await uploadToCloudinary(
      req.file.buffer,
      "brands"
    )

    const slug = slugify(name, { lower: true, strict: true });

    const newBrand = await BrandModel.create({
      name,
      slug,
      image:{
        url:url,
        public_id:public_id
      },
    });

    return res.status(201).json({
      success: true,
      message: "Brand added successfully!",
      data: newBrand,
    });
  } catch (error) {
      console.error("Internal Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error!"
        });
  }
};

export const getAllBrands = async (req, res) => {
  try {
    const page = Math.max(1,parseInt(req.query.page,10) || 1);
        const limit  = Math.max(1,parseInt(req.query.limit,10) || 10);
        const skip = (page-1) * limit;
    
    
        const allowedSortFields = ["name", "createdAt", "updatedAt"];
    
    
        const sortBy = allowedSortFields.includes(req.query.sortBy) ? req.query.sortBy : "createdAt"
 
        const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;
    
        const totalBrands = await BrandModel.countDocuments();
        const totalPages = Math.ceil(totalBrands / limit);
    
        const sortObj = {};
    
        sortObj[sortBy] = sortOrder;
        
    const brands = await BrandModel.find().sort(sortObj).skip(skip).limit(limit).lean().select("-__v");

    return res.status(200).json({
      success: true,
      message: "Brands Fetched Successfully!",
      data: brands,
    });

  } catch (error) {
        console.error("Internal Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error!"
        });
  }
};

export const deleteBrandById = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedBrand = await BrandModel.findByIdAndDelete(id);

    if (!deletedBrand) {
      return res.status(404).json({
        success: false,
        message: "Brand not found!",
      });
    }

    if(deletedBrand.image?.public_id){
      await deleteFromCloudinary(deletedBrand.image.public_id)
    }


    return res.status(200).json({
      success: true,
      message: "Brand Deleted Successfully!",
      data: deletedBrand,
    });
  } catch (error) {
    console.error("Internal Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error!"
        });
  }
};

export const getBrandById = async (req, res) => {
  try {
    const { id } = req.params;
    const brand = await BrandModel.findById(id);

    if (!brand) {
      return res.status(404).json({
        success: false,
        message: "Brand not found!",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Brand Fetched Successfully!",
      data: brand,
    });
  } catch (error) {
    console.error("Internal Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error!"
    });
  }
};

export const getBrandByBrandName = async (req, res) => {
  try {
    const {name} = req.params;
    const slug = slugify(name, { lower: true, strict: true });
    const brand = await BrandModel.findOne({ slug: slug });

    if (!brand){
      return res.status(404).json({
        success: false,
        message: "Brand not found!",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Brand Fetched Successfully!",
      data: brand,
    });
  } catch (error) {
    console.error("Internal Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error!"
        });
  }
};

export const updateBrand = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const updatedPayload = {};

    const existingBrand = await BrandModel.findById(id);

    if(!existingBrand){
        return res.status(404).json({
        success: false,
        message: "brand not found!"
      });
    }


    if (name) {
      updatedPayload.name = name;
      updatedPayload.slug = slugify(name, { strict: true, lower: true });
    }
    if (req.file) {
      const uploadedImage = await uploadToCloudinary(req.file.buffer,"brands")
    if(existingBrand.image?.public_id){
      await deleteFromCloudinary(existingBrand.image.public_id);
    }
    updatedPayload.image ={
      url:uploadedImage.url,
      public_id:uploadedImage.public_id
    }
    }

    const updatedBrand = await BrandModel.findByIdAndUpdate(
      id, 
      updatedPayload, 
      { returnDocument: "after" ,runValidators: true,}
    
    
    );

    return res.status(200).json({
      success: true,
      message: "Brand updated successfully!",
      data: updatedBrand,
    });

    
  } catch (error) {
    console.error("Internal Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error!"
        });
  }
};

