import express from "express"



import { validate } from "../middlewares/validation.middleware.js";
import {authMiddleware} from "../middlewares/auth.middleware.js"
import { otpRateLimiter } from "../middlewares/rateLimiter.middleware.js";
import { authLimiter } from "../middlewares/rateLimiter.middleware.js";
import {
registerUserSchema,
loginUserSchema,
changePasswordSchema,
logoutSchema,
refreshTokenSchema,
resendOTPSchema
} from "./Auth-Validator.js"

import {
    registerUser,
    loginUser,
    changePassword,
    logoutUser,
    refreshTokenHandler,
    verifyOTP,
    resendOTP
} from "./Auth-Controller.js"

const router = express.Router();

router.post('/refreshtoken',authLimiter,validate(refreshTokenSchema), refreshTokenHandler);
router.post('/register',authLimiter,validate(registerUserSchema),registerUser);
router.post('/verify-otp',authLimiter, verifyOTP);

router.post('/resend-otp',otpRateLimiter,validate(resendOTPSchema), resendOTP);

router.post('/login',authLimiter,validate(loginUserSchema),loginUser);

router.post('/logout',authLimiter,validate(logoutSchema),authMiddleware, logoutUser);
router.post('/changePassword',authLimiter,validate(changePasswordSchema), authMiddleware, changePassword);



export default router;

