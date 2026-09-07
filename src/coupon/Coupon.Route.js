import express from "express";
const router = express.Router();

import { validate } from "../middlewares/validation.middleware.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { adminMiddleware } from "../middlewares/admin.middleware.js";

import {
  createCoupon,
  getAllCoupons,
  deleteCouponById,
  getCouponById,
  updateCoupon,
} from "./Coupon.Controller.js";

import {
  createCouponSchema,
  getCouponByIdSchema,
  deleteCouponByIdSchema,
  updateCouponSchema,
} from "./Coupon.Validator.js";

router.post("/",authMiddleware,adminMiddleware, validate(createCouponSchema), createCoupon);
router.get("/",authMiddleware,adminMiddleware, getAllCoupons);

router.get("/:id",authMiddleware,adminMiddleware, validate(getCouponByIdSchema), getCouponById);
router.put("/:id",authMiddleware,adminMiddleware, validate(updateCouponSchema), updateCoupon);
router.delete("/:id",authMiddleware,adminMiddleware, validate(deleteCouponByIdSchema), deleteCouponById);

export default router;
