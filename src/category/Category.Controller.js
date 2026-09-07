import { CategoryModel } from "./Category.Model.js";
import slugify from "slugify"
import {uploadToCloudinary,deleteFromCloudinary} from "../services/cloudinaryService.js"
    
export const createCategory = async(req,res)=>{
    try {
        
        
        const {name} = req.body;

        const ifExist = await CategoryModel.findOne({name});


        if(ifExist){
            return res.status(409).json({
                success:false,
                message:"Category already exists!"
            })
        }


        const {url,public_id} = await uploadToCloudinary(
            req.file.buffer,
            "categories"
        );


        const slug = slugify(name,{lower:true,strict:true});

        const newCategory = await CategoryModel.create({
            name:name,
            slug:slug,
            image:{
                url:url,
                public_id:public_id
            }
        })

        return res.status(201).json({
            success:true,
            message:"Category added successfully!",
            newCategory
        })

    } catch (error) {
        console.error("Create Category Error:", error);
        return res.status(500).json({
            success: false,
            message:"Internal server error!",
            error:error.message
        })
    }
}



export const getAllCategories = async(req,res)=>{
    try{

    const page = Math.max(1,parseInt(req.query.page,10) || 1);
    const limit  = Math.max(1,parseInt(req.query.limit,10) || 10);
    const skip = (page-1) * limit;


    const allowedSortFields = ["name", "createdAt", "updatedAt"];


    const sortBy = allowedSortFields.includes(req.query.sortBy) ? req.query.sortBy : "createdAt"

    const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;

    const totalCategories = await CategoryModel.countDocuments();
    const totalPages = Math.ceil(totalCategories / limit);

    const sortObj = {};

    sortObj[sortBy] = sortOrder;
    
    const categories = await CategoryModel.find().sort(sortObj).skip(skip).limit(limit).lean().select("-__v");
    
    return res.status(200).json({
        success:true,
        message:"Categories Fetched Successfully!",
        currentPage : page,
        totalPages : totalPages,
        totalCategories : totalCategories,
        data:categories
    })

}



    catch(error){
        console.log("Get Categories Error: ",error);
        return res.status(500).json({
            success:false,
            error: error.message
        })
        
    }
}


export const deleteCategoryById = async(req,res)=>{
    try{
    const {id} = req.params;
    const deletedCategory = await CategoryModel.findByIdAndDelete(id);
    
    if (!deletedCategory) {
      return res.status(404).json({
        success: false,
        message: "Category not found!",
      });
    }

    if(deletedCategory.image?.public_id){
        await deleteFromCloudinary(deletedCategory.image.public_id);
    }

    return res.status(200).json({
        success:true,
        message:"Category Deleted Successfully!",
        data:deletedCategory
    })}
    catch(error){
        console.log("Delete Category Error:",error);
        
        res.status(500).json({
            success:false,
            message:"Internal server error!",
            error: error.message

        })
    }
}


export const getCategoryById = async(req,res)=>{
    try{
    const {id} = req.params;
    const category = await CategoryModel.findOne({_id:id});
    return res.status(200).json({
        success:true,
        message:"Category Fetched Successfully!",
        data:category
    })}
        
    catch(error){
        console.log("Get Category Error: ",error);
        return res.status(500).json({
            success:false,
            message:"Internal server error!",
            error: error.message
        })
        
    }
}

export const getCategoryByName = async(req,res)=>{
    try{
    const {name} = req.params;

    const slug = slugify(name,{lower:true,strict:true});

    const category = await CategoryModel.findOne({slug:slug});
    return res.status(200).json({
        success:true,
        message:"Category Fetched Successfully!",
        data:category
    })}    
    
    catch(error){
        console.log("Get Category Error: ",error);
        return res.status(500).json({
            success:false,
            message:"Internal server error!",
            error: error.message
        })
        
    }
}



export const getCategoryBySlug = async(req,res)=>{
    try{
    const {slug} = req.params;
    const category = await CategoryModel.findOne({slug:slug});
    return res.status(200).json({
        success:true,
        message:"Category Fetched Successfully!",
        data:category
    })
}      
    catch(error){
        console.log("Get Category Error: ",error);
        return res.status(500).json({
            success:false,
            message:"Internal server error!",
            error: error.message
        })
        
    }
    
}


export const updateCategory = async(req,res)=>{
    try{
    const {id} =  req.params;
    const {name} = req.body;

    const updatedPayload = {};
    
    const existingCategory = await CategoryModel.findById(id);
    if (!existingCategory) {
      return res.status(404).json({
        success: false,
        message: "Category not found!"
      });
    }

    if(name){
        updatedPayload.name = name;
        updatedPayload.slug = slugify(name,{strict:true,lower:true});}

    if(req.file){

        const uploadedImage = await uploadToCloudinary(req.file.buffer,"categories");
    
        if(existingCategory.image?.public_id){
            await deleteFromCloudinary(existingCategory.image.public_id);
        }

        updatedPayload.image = {
            url:uploadedImage.url,
            public_id:uploadedImage.public_id
        }
    }


    const updatedCategory =  await CategoryModel.findByIdAndUpdate(
        id,
        updatedPayload,
        {new:true,runValidators:true}
    )



      return res.status(200).json({
      success: true,
      message: "Category updated successfully!",
      data: updatedCategory
        });
        
    }
    catch(error){
        console.log("Update Category Error: ",error);
        return res.status(500).json({
            success:false,
            message:"Internal server error!",
            error: error.message 
        })
    }

}