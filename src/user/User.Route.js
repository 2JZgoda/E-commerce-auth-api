import express from "express"
const router = express.Router();


import {validate} from "../middlewares/validation.middleware.js"
import { adminMiddleware } from "../middlewares/admin.middleware.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

import {
    createUser,
    getAllUsers,
    deleteUserById,
    getUserById,
    getUserByUsername,
    updateUser
} from "./User.Controller.js"

import {
  createUserSchema,
  getUserByIdSchema,
  deleteUserByIdSchema,
  updateUserSchema,
  getUserByUsernameSchema,
} from "./User.Validator.js";

router.post("/",authMiddleware,adminMiddleware, validate(createUserSchema),createUser);
router.get("/",authMiddleware,adminMiddleware, getAllUsers);
router.get("/username/:username",authMiddleware,adminMiddleware, validate(getUserByUsernameSchema),getUserByUsername);
router.delete("/:id",authMiddleware,adminMiddleware, validate(deleteUserByIdSchema),deleteUserById);
router.get("/:id",authMiddleware ,adminMiddleware,validate(getUserByIdSchema),getUserById);
router.put("/:id",authMiddleware,adminMiddleware,validate(updateUserSchema),updateUser);



export default router