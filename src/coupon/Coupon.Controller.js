import { CouponModel } from "./Coupon.Model.js";

export const createCoupon = async (req, res) => {
  try {
    const { code, discount, expires } = req.body;

    const ifExist = await CouponModel.findOne({ code: code.toUpperCase() });
    if (ifExist) {
      return res.status(409).json({
        success: false,
        message: "Coupon already exists!",
      });
    }

    const newCoupon = await CouponModel.create({
      code,
      discount,
      expires,
    });

    return res.status(201).json({
      success: true,
      message: "Coupon added successfully!",
      data: newCoupon,
    });
  } catch (error) {
    console.error("Create Coupon Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error!",
      error: error.message,
    });
  }
};

export const getAllCoupons = async (req, res) => {
  try {

   const page = Math.max(1,parseInt(req.query.page,10) || 1);
    const limit  = Math.max(1,parseInt(req.query.limit,10) || 10);
    const skip = (page-1) * limit;


    const allowedSortFields = ["name", "createdAt", "updatedAt"];


    const sortBy = allowedSortFields.includes(req.query.sortBy) ? req.query.sortBy : "createdAt"

    const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;

    const totalCoupons = await CouponModel.countDocuments();
    const totalPages = Math.ceil(totalCoupons / limit);

    const sortObj = {};

    sortObj[sortBy] = sortOrder;

    const coupons = await CouponModel.find().sort(sortObj).skip(skip).limit(limit).lean().select("-__v");

    if (coupons.length === 0) {
      return res.status(200).json({
        success: true,
        message: "There Is No Coupons To Fetch",
        data: coupons,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Coupons Fetched Successfully!",
      data: coupons,
    });
  } catch (error) {
    console.log("Get Coupons Error: ", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error!",
      error: error.message,
    });
  }
};

export const deleteCouponById = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCoupon = await CouponModel.findByIdAndDelete(id);

    if (!deletedCoupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found!",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Coupon Deleted Successfully!",
      data: deletedCoupon,
    });
  } catch (error) {
    console.log("Delete Coupon Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error!",
      error: error.message,
    });
  }
};

export const getCouponById = async (req, res) => {
  try {
    const { id } = req.params;
    const coupon = await CouponModel.findById(id);

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found!",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Coupon Fetched Successfully!",
      data: coupon,
    });
  } catch (error) {
    console.log("Get Coupon Error: ", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error!",
      error: error.message,
    });
  }
};

export const updateCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const { code, discount, expires } = req.body;

    const updatedPayload = {};
    if (code) updatedPayload.code = code;
    if (discount !== undefined) updatedPayload.discount = discount;
    if (expires) updatedPayload.expires = expires;

    const updatedCoupon = await CouponModel.findByIdAndUpdate(
      id,
      updatedPayload,
      { new: true, runValidators: true }
    );

    if (!updatedCoupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found!",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Coupon updated successfully!",
      data: updatedCoupon,
    });
  } catch (error) {
    console.log("Update Coupon Error: ", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error!",
      error: error.message,
    });
  }
};
