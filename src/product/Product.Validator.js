import Joi from "joi"

const idValidation = Joi.string().hex().length(24).messages({
    "string.hex":"id is invalid",
    "string.length": "id must be 24 characters",
})


export const createProductSchema = Joi.object({
body:Joi.object({
    
    title: Joi.string()
    .trim()
    .min(3)
    .pattern(/^[a-zA-Z0-9\u0621-\u064A\s\-().&+/"']+$/)
    .max(100)
    .required()
    .messages({
    "string.base": "Product title must be a string",
    "string.min": "Too short product title",
    "string.max": "Too long product title",
    "string.empty": "Product title is required",
    "any.required": "Product title is required",
    }),

    description: Joi.string()
    .min(15)
    .max(1000)
    .required()
    .messages({
    "string.base": "description must be a string",
    "string.min": "Too short description",
    "string.max": "Too long description",
    "string.empty": "description is required",
    "any.required": "description is required",
   
    }),

    quantity: Joi.number()
    .integer()
    .min(0)
    .required()
    .messages({
    "number.base":"Quantity must be a number",
    "number.integer":"Quantity must be an integer",
    "number.min":"Quantity cannot be negative",
    "any.required": "Product quantity is required",
    }),

    price: Joi.number()
    .min(0)
    .required()
    .messages({
    "number.base":"Price must be a number",
    "number.min":"Price cannot be negative",
    "any.required": "Price is required",
    }),

    priceAfterDiscount: Joi.number()
    .min(0)
    .less(Joi.ref("price"))
    .messages({
    "number.base":"Price must be a number",
    "number.min":"Price cannot be negative",
    "number.less":"Price after discount must be less than price"
    }),

    imageCover: Joi.string()
    .required()
    .messages({
    "string.base":"Image cover must be a string",
    "string.empty":"Product cover image is required",
    "any.required":"Product cover image is required"
    }),

    category: idValidation
    .required()
    .messages({

    "any.required": "Product must belong to a category",
    }),

    subCategory: idValidation,

    brand: idValidation
    .required()
    .messages({

    "any.required": "Product must belong to a brand",

    }),


}).required(),
}).unknown(true);









export const getProductByProductnameSchema = Joi.object({
  params: Joi.object({
    name: Joi.string()
      .trim()
      .min(3)
      .max(100)
      .required()
      .messages({
        "string.base": "Product name must be a string",
        "string.empty": "Product name cannot be empty",
        "string.min": "Product name must be at least 2 characters long",
        "string.max": "Product name cannot exceed 100 characters",
        "any.required": "Product name parameter is required",
      }),
  }).required(),
}).unknown(true);

export const getAllProductsSchema = Joi.object({
query:Joi.object(),
}).unknown(true);

export const getProductByIdSchema = Joi.object({
params:Joi.object({
    id: idValidation
    .required()
    .messages({
    "any.required": "Product id is required",
    })
    }).required()
}).unknown(true);

export const deleteProductByIdSchema = Joi.object({
params:Joi.object({
    id: idValidation
    .required()
    .messages({
    "any.required": "Product id is required",
    })
    
}).required()
}).unknown(true);


export const updateProductByIdSchema = Joi.object({
    params:Joi.object({
    id: idValidation
    .required()
    .messages({
    "any.required": "Product id is required",
    })
    }).required(),

    body:Joi.object({

    title: Joi.string()
    .trim()
    .min(3)
    .max(100),

    description: Joi.string()
    .min(15)
    .max(1000),

    quantity: Joi.number()
    .integer()
    .min(0),

    price: Joi.number()
    .min(0),

    priceAfterDiscount: Joi.number()
    .min(0)
    .less(Joi.ref("price")),

    imageCover: Joi.string(),
    
    category: idValidation,

    subCategory: idValidation,

    brand: idValidation,
    }).min(1)
}).unknown(true);