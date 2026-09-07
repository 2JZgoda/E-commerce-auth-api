import { ReviewModel } from "./Review.Model.js";
import { ProductModel } from "../product/Product.Model.js";

export const createReview = async (req, res) => {
  try {
    const { text, rating, product } = req.body;
    const userId = req.userInfo?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "You must be logged in to create a review!",
      });
    }

    const productExists = await ProductModel.findById(product);
    if (!productExists) {
      return res.status(404).json({
        success: false,
        message: "Product not found!",
      });
    }

    const alreadyReviewed = await ReviewModel.findOne({
      product,
      user: userId,
    });

    if (alreadyReviewed) {
      return res.status(409).json({
        success: false,
        message: "You already reviewed this product!",
      });
    }

    const newReview = await ReviewModel.create({
      text,
      rating,
      product,
      user: userId,
    });

    // update product rating
    const reviews = await ReviewModel.find({ product });
    const ratingAvg =
      reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;

    await ProductModel.findByIdAndUpdate(product, {
      ratingAvg: Math.round(ratingAvg * 10) / 10,
      ratingCount: reviews.length,
    });

    return res.status(201).json({
      success: true,
      message: "Review added successfully!",
      data: newReview,
    });
  } catch (error) {
    console.error("Create Review Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error!",
      error: error.message,
    });
  }
};

export const getAllReviews = async (req, res) => {
  try {
                const page = Math.max(1,parseInt(req.query.page,10) || 1);
                    const limit  = Math.max(1,parseInt(req.query.limit,10) || 10);
                    const skip = (page-1) * limit;
                
                
                    const allowedSortFields = ["name", "createdAt", "updatedAt"];
                
                
                    const sortBy = allowedSortFields.includes(req.query.sortBy) ? req.query.sortBy : "createdAt"
                
                    const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;
                
                    const totalReviewes = await ReviewModel.countDocuments();
                    const totalPages = Math.ceil(totalReviewes / limit);
                
                    const sortObj = {};
                
                    sortObj[sortBy] = sortOrder;
    
    const reviews = await ReviewModel.find().sort(sortObj).skip(skip).limit(limit).lean().select("-__v")
      .populate("user", "name username")
      .populate("product", "title");

    return res.status(200).json({
      success: true,
      message: "Reviews Fetched Successfully!",
      data: reviews,
    });
  } catch (error) {
    console.log("Get Reviews Error: ", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error!",
      error: error.message,
    });
  }
};

export const getReviewsByProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const reviews = await ReviewModel.find({ product: productId })
      .populate("user", "name username")
      .populate("product", "title");

    return res.status(200).json({
      success: true,
      message: "Reviews Fetched Successfully!",
      data: reviews,
    });
  } catch (error) {
    console.log("Get Reviews Error: ", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error!",
      error: error.message,
    });
  }
};

export const deleteReviewById = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedReview = await ReviewModel.findByIdAndDelete(id);

    if (!deletedReview) {
      return res.status(404).json({
        success: false,
        message: "Review not found!",
      });
    }

    // recalculate product rating
    const reviews = await ReviewModel.find({ product: deletedReview.product });
    const ratingAvg =
      reviews.length > 0
        ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
        : 0;

    await ProductModel.findByIdAndUpdate(deletedReview.product, {
      ratingAvg: Math.round(ratingAvg * 10) / 10,
      ratingCount: reviews.length,
    });

    return res.status(200).json({
      success: true,
      message: "Review Deleted Successfully!",
      data: deletedReview,
    });
  } catch (error) {
    console.log("Delete Review Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error!",
      error: error.message,
    });
  }
};

export const getReviewById = async (req, res) => {
  try {
    const { id } = req.params;
    const review = await ReviewModel.findById(id)
      .populate("user", "name username")
      .populate("product", "title");

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found!",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Review Fetched Successfully!",
      data: review,
    });
  } catch (error) {
    console.log("Get Review Error: ", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error!",
      error: error.message,
    });
  }
};

export const updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { text, rating } = req.body;

    const updatedPayload = {};
    if (text) updatedPayload.text = text;
    if (rating) updatedPayload.rating = rating;

    const updatedReview = await ReviewModel.findByIdAndUpdate(
      id,
      updatedPayload,
      { new: true, runValidators: true }
    );

    if (!updatedReview) {
      return res.status(404).json({
        success: false,
        message: "Review not found!",
      });
    }

    // recalculate
    const reviews = await ReviewModel.find({ product: updatedReview.product });
    const ratingAvg =
      reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;

    await ProductModel.findByIdAndUpdate(updatedReview.product, {
      ratingAvg: Math.round(ratingAvg * 10) / 10,
      ratingCount: reviews.length,
    });

    return res.status(200).json({
      success: true,
      message: "Review updated successfully!",
      data: updatedReview,
    });
  } catch (error) {
    console.log("Update Review Error: ", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error!",
      error: error.message,
    });
  }
};
