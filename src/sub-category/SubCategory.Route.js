import express from "express"
const router = express.Router();


import {validate} from "../middlewares/validation.middleware.js"
import { adminMiddleware } from "../middlewares/admin.middleware.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {uploadSingleImage} from "../middlewares/uploadImage.middleware.js"
import {
    createSubCategory,
    getAllSubCategorys,
    deleteSubCategoryById,
    getSubCategoryById,
    getSubCategoryBySubCategorynName,
    updateSubCategory
} from "./SubCategory.Controller.js"

import {
  createSubCategorySchema,
  getSubCategoryByIdSchema,
  deleteSubCategoryByIdSchema,
  updateSubCategorySchema,
  getSubCategoryBySubCategorynNameSchema,
} from "./SubCategory.Validator.js";


router.post("/",authMiddleware,adminMiddleware,uploadSingleImage("image"), validate(createSubCategorySchema),createSubCategory);
router.get("/", getAllSubCategorys);
router.get("/name/:name", validate(getSubCategoryBySubCategorynNameSchema),getSubCategoryBySubCategorynName);
router.get("/:id", validate(getSubCategoryByIdSchema),getSubCategoryById);
router.put("/:id",authMiddleware,adminMiddleware,uploadSingleImage("image"),validate(updateSubCategorySchema),updateSubCategory);
router.delete("/:id",authMiddleware,adminMiddleware, validate(deleteSubCategoryByIdSchema),deleteSubCategoryById);

export default router