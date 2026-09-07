import { ProductModel } from "./Product.Model.js";
import slugify from "slugify";

export const createProduct = async (req, res) => {
  try {
    const {
      title,
      description,
      quantity,
      price,
      priceAfterDiscount,
      imageCover,
      category,
      subCategory,
      brand,
    } = req.body;

    const ifExist = await ProductModel.findOne({ title });
    if (ifExist) {
      return res.status(409).json({
        success: false,
        message: "Product already exists!",
      });
    }

    const slug = slugify(title, { lower: true, strict: true });

    const newProduct = await ProductModel.create({
      title,
      slug,
      description,
      quantity,
      price,
      priceAfterDiscount,
      imageCover,
      category,
      subCategory,
      brand,
    });

    return res.status(201).json({
      success: true,
      message: "Product added successfully!",
      data: newProduct,
    });
  } catch (error) {
    console.error("Create Product Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error!",
      error: error.message,
    });
  }
};

export const getAllProducts = async (req, res) => {
  try {
           const page = Math.max(1,parseInt(req.query.page,10) || 1);
                const limit  = Math.max(1,parseInt(req.query.limit,10) || 10);
                const skip = (page-1) * limit;
            
            
                const allowedSortFields = ["name", "createdAt", "updatedAt"];
            
            
                const sortBy = allowedSortFields.includes(req.query.sortBy) ? req.query.sortBy : "createdAt"
            
                const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;
            
                const totalProducts = await ProductModel.countDocuments();
                const totalPages = Math.ceil(totalProducts / limit);
            
                const sortObj = {};
            
                sortObj[sortBy] = sortOrder;

    const products = await ProductModel.find().sort(sortObj).skip(skip).limit(limit).lean().select("-__v")
      .populate("category", "name")
      .populate("subCategory", "name")
      .populate("brand", "name")

    return res.status(200).json({
      success: true,
      message: "Products Fetched Successfully!",
      data: products,
    });
  } catch (error) {
    console.log("Get Products Error: ", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error!",
      error: error.message,
    });
  }
};

export const deleteProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = await ProductModel.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found!",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product Deleted Successfully!",
      data: deletedProduct,
    });
  } catch (error) {
    console.log("Delete Product Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error!",
      error: error.message,
    });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await ProductModel.findById(id)
      .populate("category", "name")
      .populate("subCategory", "name")
      .populate("brand", "name");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found!",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product Fetched Successfully!",
      data: product,
    });
  } catch (error) {
    console.log("Get Product Error: ", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error!",
      error: error.message,
    });
  }
};

export const getProductByProductname = async (req, res) => {
  try {
    const { name } = req.params;
    const product = await ProductModel.findOne({ title: name })
      .populate("category", "name")
      .populate("subCategory", "name")
      .populate("brand", "name");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found!",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product Fetched Successfully!",
      data: product,
    });
  } catch (error) {
    console.log("Get Product Error: ", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error!",
      error: error.message,
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      quantity,
      price,
      priceAfterDiscount,
      imageCover,
      category,
      subCategory,
      brand,
    } = req.body;

    const updatedPayload = {};
    if (title) {
      updatedPayload.title = title;
      updatedPayload.slug = slugify(title, { strict: true, lower: true });
    }
    if (description) updatedPayload.description = description;
    if (quantity !== undefined) updatedPayload.quantity = quantity;
    if (price !== undefined) updatedPayload.price = price;
    if (priceAfterDiscount !== undefined)
      updatedPayload.priceAfterDiscount = priceAfterDiscount;
    if (imageCover) updatedPayload.imageCover = imageCover;
    if (category) updatedPayload.category = category;
    if (subCategory) updatedPayload.subCategory = subCategory;
    if (brand) updatedPayload.brand = brand;

    const updatedProduct = await ProductModel.findByIdAndUpdate(
      id,
      updatedPayload,
      { new: true, runValidators: true }
    )
      .populate("category", "name")
      .populate("subCategory", "name")
      .populate("brand", "name");

    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found!",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product updated successfully!",
      data: updatedProduct,
    });
  } catch (error) {
    console.log("Update Product Error: ", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error!",
      error: error.message,
    });
  }
};
