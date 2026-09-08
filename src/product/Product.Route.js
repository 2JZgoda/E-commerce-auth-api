import express from "express";
const router = express.Router();

import { validate } from "../middlewares/validation.middleware.js";
import { adminMiddleware } from "../middlewares/admin.middleware.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { uploadSingleImage } from "../middlewares/uploadImage.middleware.js";

import {
    createProduct,
    getAllProducts,
    deleteProductById,
    getProductById,
    getProductByProductname,
    updateProduct
} from "./Product.Controller.js";

import {
  createProductSchema,
  getProductByIdSchema,
  deleteProductByIdSchema,
  updateProductByIdSchema,
  getProductByProductnameSchema,
} from "./Product.Validator.js";

router.post("/", authMiddleware, adminMiddleware, uploadSingleImage("imageCover"), validate(createProductSchema), createProduct);
router.get("/", getAllProducts);
router.get("/name/:name", validate(getProductByProductnameSchema), getProductByProductname);

router.get("/:id", validate(getProductByIdSchema), getProductById);
router.put("/:id", authMiddleware, adminMiddleware, uploadSingleImage("imageCover"), validate(updateProductByIdSchema), updateProduct);
router.delete("/:id", authMiddleware, adminMiddleware, validate(deleteProductByIdSchema), deleteProductById);

export default router;