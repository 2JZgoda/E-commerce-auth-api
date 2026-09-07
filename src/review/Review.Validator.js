import Joi from "joi";

const idValidation = Joi.string().hex().length(24).messages({
  "string.hex": "id is invalid",
  "string.length": "id must be 24 characters",
});

export const createReviewSchema = Joi.object({
  body: Joi.object({
    text: Joi.string().trim().min(3).max(500).required().messages({
      "string.base": "Review text must be a string",
      "string.min": "Too short review text",
      "string.max": "Too long review text",
      "string.empty": "Review text is required",
      "any.required": "Review text is required",
    }),
    rating: Joi.number().integer().min(1).max(5).required().messages({
      "number.base": "Rating must be a number",
      "number.min": "Rating must be at least 1",
      "number.max": "Rating cannot exceed 5",
      "any.required": "Rating is required",
    }),
    product: idValidation.required().messages({
      "any.required": "Product id is required",
    }),
  }).required(),
}).unknown(true);

export const getReviewByIdSchema = Joi.object({
  params: Joi.object({
    id: idValidation.required().messages({
      "any.required": "Review id is required",
    }),
  }).required(),
}).unknown(true);

export const getReviewsByProductSchema = Joi.object({
  params: Joi.object({
    productId: idValidation.required().messages({
      "any.required": "Product id is required",
    }),
  }).required(),
}).unknown(true);

export const deleteReviewByIdSchema = Joi.object({
  params: Joi.object({
    id: idValidation.required().messages({
      "any.required": "Review id is required",
    }),
  }).required(),
}).unknown(true);

export const updateReviewSchema = Joi.object({
  params: Joi.object({
    id: idValidation.required().messages({
      "any.required": "Review id is required",
    }),
  }).required(),
  body: Joi.object({
    text: Joi.string().trim().min(3).max(500),
    rating: Joi.number().integer().min(1).max(5),
  }).min(1),
}).unknown(true);
