import express from "express";
const router = express.Router();

import { validate } from "../middlewares/validation.middleware.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { adminMiddleware } from "../middlewares/admin.middleware.js";

import {
  createReview,
  getAllReviews,
  deleteReviewById,
  getReviewById,
  getReviewsByProduct,
  updateReview,
} from "./Review.Controller.js";

import {
  createReviewSchema,
  getReviewByIdSchema,
  deleteReviewByIdSchema,
  updateReviewSchema,
  getReviewsByProductSchema,
} from "./Review.Validator.js";

router.post("/", authMiddleware, validate(createReviewSchema), createReview);

router.get("/", getAllReviews);

router.get("/product/:productId", validate(getReviewsByProductSchema), getReviewsByProduct);
router.get("/:id", validate(getReviewByIdSchema), getReviewById);
router.put("/:id", authMiddleware, validate(updateReviewSchema), updateReview);
router.delete("/:id", authMiddleware, validate(deleteReviewByIdSchema), deleteReviewById);

export default router;
