import express from "express"
const router = express.Router();

import {uploadSingleImage} from "../middlewares/uploadImage.middleware.js"
import {validate} from "../middlewares/validation.middleware.js"
import { adminMiddleware } from "../middlewares/admin.middleware.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {
    createCategory,
    getAllCategories,
    deleteCategoryById,
    getCategoryById,
    getCategoryByName,
    getCategoryBySlug,
    updateCategory

} from "./Category.Controller.js"

import {
  createCategorySchema,
  getCategoryByIdSchema,
  deleteCategoryByIdSchema,
  updateCategoryByIdSchema,
  getCategoryByNameSchema,
  getCategoryBySlugSchema
} from "./Category.Validator.js";




router.post("/",authMiddleware,adminMiddleware,uploadSingleImage("image"), validate(createCategorySchema),createCategory);//*admin
router.get("/", getAllCategories);
router.get("/name/:name", validate(getCategoryByNameSchema),getCategoryByName);//*public
router.get("/slug/:slug", validate(getCategoryBySlugSchema),getCategoryBySlug);//*public
router.get("/:id", validate(getCategoryByIdSchema),getCategoryById);//*public
router.put("/:id",authMiddleware,adminMiddleware,uploadSingleImage("image"),validate(updateCategoryByIdSchema),updateCategory);//*admin
router.delete("/:id",authMiddleware,adminMiddleware, validate(deleteCategoryByIdSchema),deleteCategoryById);//*admin

export default router;









/*
//* Another methods to make routes
router.route("/")
.post (validate(createCategorySchema),createCategory)
.get(getAllCategories)

router.route("/:id")
.get(validate(getCategoryByIdSchema),getCategoryById)
.put(validate(updateCategoryByIdSchema),updateCategory)
.delete(validate(deleteCategoryByIdSchema),deleteCategoryById)

router.get("/slug/:slug", validate(getCategoryBySlugSchema),getCategoryBySlug);
router.get("/name/:name", validate(getCategoryByNameSchema),getCategoryByName);
*/

/*
//*Routes with explained end points
router.post("/CreateCategory", validate(createCategorySchema),createCategory);
router.get("/getAllCategories", getAllCategories);
router.get("/getCategoryById/:id", validate(getCategoryByIdSchema),getCategoryById);
router.get("/getCategoryByName/:name", validate(getCategoryByNameSchema),getCategoryByName);
router.get("/getCategoryBySlug/:slug", validate(getCategoryBySlugSchema),getCategoryBySlug);
router.put("/updateCategory/:id",validate(updateCategoryByIdSchema),updateCategory);
router.delete("/deleteCategoryById/:id", validate(deleteCategoryByIdSchema),deleteCategoryById);
*/


