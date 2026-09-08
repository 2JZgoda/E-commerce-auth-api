    import Joi from "joi";

const idValidation = Joi.string().hex().length(24).messages({
  "string.hex": "id is invalid",
  "string.length": "id must be 24 characters",
});

const titleValidation = Joi.string()
  .trim()
  .min(3)
  .max(100)
  .pattern(/^[a-zA-Z0-9\u0621-\u064A\s\-().&+/"']+$/)
  .messages({
    "string.base": "Product title must be a string",
    "string.min": "Too short product title",
    "string.max": "Too long product title",
    "string.empty": "Product title is required",
    "string.pattern.base": "Product title contains invalid characters",
  });

const descriptionValidation = Joi.string()
  .min(15)
  .max(1000)
  .messages({
    "string.base": "description must be a string",
    "string.min": "Too short description",
    "string.max": "Too long description",
    "string.empty": "description is required",
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

export const createProductSchema = Joi.object({
  body: Joi.object({
    title: titleValidation.required().messages({
      "any.required": "Product title is required",
    }),
    description: descriptionValidation.required().messages({
      "any.required": "description is required",
    }),
    quantity: Joi.number()
      .integer()
      .min(0)
      .required()
      .messages({
        "number.base": "Quantity must be a number",
        "number.integer": "Quantity must be an integer",
        "number.min": "Quantity cannot be negative",
        "any.required": "Product quantity is required",
      }),
    price: Joi.number()
      .min(0)
      .required()
      .messages({
        "number.base": "Price must be a number",
        "number.min": "Price cannot be negative",
        "any.required": "Price is required",
      }),
    priceAfterDiscount: Joi.number()
      .min(0)
      .less(Joi.ref("price"))
      .messages({
        "number.base": "Price must be a number",
        "number.min": "Price cannot be negative",
        "number.less": "Price after discount must be less than price",
      }),
    category: idValidation.required().messages({
      "any.required": "Product must belong to a category",
    }),
    subCategory: idValidation,
    brand: idValidation.required().messages({
      "any.required": "Product must belong to a brand",
    }),
  }).required(),

  file: imageValidation.required().messages({
    "any.required": "Product cover image is required",
  }),
}).unknown(true);

export const getProductByProductnameSchema = Joi.object({
  params: Joi.object({
    name: titleValidation.required().messages({
      "any.required": "Product name parameter is required",
    }),
  }).required(),
}).unknown(true);

export const getAllProductsSchema = Joi.object({
  query: Joi.object(),
}).unknown(true);

export const getProductByIdSchema = Joi.object({
  params: Joi.object({
    id: idValidation.required().messages({
      "any.required": "Product id is required",
    }),
  }).required(),
}).unknown(true);

export const deleteProductByIdSchema = Joi.object({
  params: Joi.object({
    id: idValidation.required().messages({
      "any.required": "Product id is required",
    }),
  }).required(),
}).unknown(true);

export const updateProductByIdSchema = Joi.object({
  params: Joi.object({
    id: idValidation.required().messages({
      "any.required": "Product id is required",
    }),
  }).required(),

  body: Joi.object({
    title: titleValidation,
    description: descriptionValidation,
    quantity: Joi.number().integer().min(0),
    price: Joi.number().min(0),
    priceAfterDiscount: Joi.number().min(0).less(Joi.ref("price")),
    category: idValidation,
    subCategory: idValidation,
    brand: idValidation,
  }).optional(),

  file: imageValidation.optional(),
})
  .unknown(true)
  .or(
    "file",
    "body.title",
    "body.description",
    "body.quantity",
    "body.price",
    "body.priceAfterDiscount",
    "body.category",
    "body.subCategory",
    "body.brand"
  )
  .messages({
    "object.missing": "At least one field must be provided for update",
  });