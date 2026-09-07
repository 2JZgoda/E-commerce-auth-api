import express from "express"
const router = express.Router();


import {validate} from "../middlewares/validation.middleware.js"
import { adminMiddleware } from "../middlewares/admin.middleware.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

import {
    createProduct,
    getAllProducts,
    deleteProductById,
    getProductById,
    getProductByProductname,
    updateProduct
} from "./Product.Controller.js"

import {
  createProductSchema,
  getProductByIdSchema,
  deleteProductByIdSchema,
  updateProductByIdSchema,
  getProductByProductnameSchema,
} from "./Product.Validator.js";



router.post("/",authMiddleware,adminMiddleware, validate(createProductSchema),createProduct);//*admin
router.get("/", getAllProducts);//*public -- not required to be a customer that have account
router.get("/name/:name", validate(getProductByProductnameSchema),getProductByProductname);

router.get("/:id", validate(getProductByIdSchema),getProductById);
router.put("/:id",authMiddleware,adminMiddleware,validate(updateProductByIdSchema),updateProduct);//*admin
router.delete("/:id",authMiddleware,adminMiddleware, validate(deleteProductByIdSchema),deleteProductById);//*admin




export default router