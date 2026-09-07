import Joi from "joi";

const idValidation = Joi.string().hex().length(24).messages({
  "string.hex": "id is invalid",
  "string.length": "id must be 24 characters",
});


const imageValidation = Joi.object({
    fieldname: Joi.string().required(),
    originalname: Joi.string().required(),
    encoding: Joi.string().required(),

    mimetype: Joi.string()
        .valid("image/jpeg", "image/png", "image/webp", "image/jpg")
        .required()
        .messages({
        "any.only": "Only image files (JPEG, PNG, WEBP, and JPG) are allowed",
        }),

    buffer: Joi.binary().required(),

    size: Joi.number()
        .max(5 * 1024 * 1024)
        .required(),
    });


export const createSubCategorySchema = Joi.object({
  body: Joi.object({
    name: Joi.string()
      .trim()
      .min(2)
      .max(50)
      .pattern(/^[a-zA-Z0-9\u0621-\u064A]+(?: [a-zA-Z0-9\u0621-\u064A]+)*$/)
      .required()
      .messages({
        "string.base": "SubCategory name must be a string",
        "string.min": "Too short SubCategory name",
        "string.max": "Too long SubCategory name",
        "string.empty": "SubCategory name is required",
        "string.pattern.base": "SubCategory name contains invalid characters",
        "any.required": "SubCategory name is required",
      }),
    category: idValidation.required().messages({
      "any.required": "SubCategory must belong to a parent category",
    }),
  }).required(),

  file:imageValidation
  .required()
  .messages({
    "any.required":"subcategory image is required"
  })
}).unknown(true);

export const getSubCategoryByIdSchema = Joi.object({
  params: Joi.object({
    id: idValidation.required().messages({
      "any.required": "SubCategory id is required",
    }),
  }).required(),
}).unknown(true);

export const getSubCategoryBySubCategorynNameSchema = Joi.object({
  params: Joi.object({
    name: Joi.string()
      .trim()
      .min(2)
      .max(50)
      .required()
      .messages({
        "string.base": "SubCategory name must be a string",
        "string.min": "Too short SubCategory name",
        "string.max": "Too long SubCategory name",
        "string.empty": "SubCategory name is required",
        "any.required": "SubCategory name is required",
      }),
  }).required(),
}).unknown(true);

export const deleteSubCategoryByIdSchema = Joi.object({
  params: Joi.object({
    id: idValidation.required().messages({
      "any.required": "SubCategory id is required",
    }),
  }).required(),
}).unknown(true);

export const updateSubCategorySchema = Joi.object({
  params: Joi.object({
    id: idValidation.required().messages({
      "any.required": "SubCategory id is required",
    }),
  }).required(),

  body: Joi.object({
    name: Joi.string()
      .trim()
      .min(2)
      .max(50)
      .pattern(/^[a-zA-Z0-9\u0621-\u064A]+(?: [a-zA-Z0-9\u0621-\u064A]+)*$/),
    category: idValidation,
  }).optional(),

  file: imageValidation.optional(),
}).unknown(true)
.or("file","body.name","body.category")
.messages({
  "object.missing":"At least one field (name,category,image) must be provided for update"
});
