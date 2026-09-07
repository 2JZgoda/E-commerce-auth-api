import Joi from "joi";

const idValidation = Joi.string().hex().length(24).messages({
  "string.hex": "id is invalid",
  "string.length": "id must be 24 characters",
});

export const createCouponSchema = Joi.object({
  body: Joi.object({
    code: Joi.string()
      .trim()
      .uppercase()
      .min(3)
      .max(30)
      .required()
      .messages({
        "string.base": "Coupon code must be a string",
        "string.min": "Too short coupon code",
        "string.max": "Too long coupon code",
        "string.empty": "Coupon code is required",
        "any.required": "Coupon code is required",
      }),
    discount: Joi.number().min(0).required().messages({
      "number.base": "Discount must be a number",
      "number.min": "Discount cannot be negative",
      "any.required": "Discount is required",
    }),
    expires: Joi.date().greater("now").required().messages({
      "date.base": "Expires must be a valid date",
      "date.greater": "Expiration date must be in the future",
      "any.required": "Expiration date is required",
    }),
  }).required(),
}).unknown(true);

export const getCouponByIdSchema = Joi.object({
  params: Joi.object({
    id: idValidation.required().messages({
      "any.required": "Coupon id is required",
    }),
  }).required(),
}).unknown(true);

export const deleteCouponByIdSchema = Joi.object({
  params: Joi.object({
    id: idValidation.required().messages({
      "any.required": "Coupon id is required",
    }),
  }).required(),
}).unknown(true);

export const updateCouponSchema = Joi.object({
  params: Joi.object({
    id: idValidation.required().messages({
      "any.required": "Coupon id is required",
    }),
  }).required(),
  body: Joi.object({
    code: Joi.string().trim().uppercase().min(3).max(30),
    discount: Joi.number().min(0),
    expires: Joi.date().greater("now"),
  }).min(1),
}).unknown(true);
