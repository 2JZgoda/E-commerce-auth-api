import express from "express"
const router = express.Router();


import {validate} from "../middlewares/validation.middleware.js"
import { adminMiddleware } from "../middlewares/admin.middleware.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { uploadSingleImage } from "../middlewares/uploadImage.middleware.js";

import {
    createBrand,
    getAllBrands,
    deleteBrandById,
    getBrandById,
    getBrandByBrandName,
    updateBrand,

} from "./Brand.Controller.js"

import {
  createBrandSchema,
  getBrandByIdSchema,
  deleteBrandByIdSchema,
  updateBrandSchema,
  getBrandByBrandNameSchema,
} from "./Brand.Validator.js";


router.get("/", getAllBrands);
router.post("/",authMiddleware,adminMiddleware,uploadSingleImage("image"), validate(createBrandSchema),createBrand);

router.get("/name/:name", validate(getBrandByBrandNameSchema),getBrandByBrandName);

router.get("/:id", validate(getBrandByIdSchema),getBrandById);

router.put("/:id",authMiddleware,adminMiddleware,uploadSingleImage("image"),validate(updateBrandSchema),updateBrand);
router.delete("/:id",authMiddleware,adminMiddleware, validate(deleteBrandByIdSchema),deleteBrandById);


export default router