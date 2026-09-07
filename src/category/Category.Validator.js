    import Joi from "joi"

    const idValidation = Joi.string().hex().length(24).messages({
        "string.hex":"id is invalid",
        "string.length": "id must be 24 characters",
    })

    const imageValidation = Joi.object({
    fieldname: Joi.string().required(),
    originalname: Joi.string().required(),
    encoding: Joi.string().required(),

    mimetype: Joi.string()
        .valid("image/jpeg", "image/png", "image/webp", "image/jpg",'image/avif')
        .required()
        .messages({
        "any.only": "Only image files (JPEG, PNG, WEBP, and JPG) are allowed",
        }),

    buffer: Joi.binary().required(),

    size: Joi.number()
        .max(5 * 1024 * 1024)
        .required(),
    });

    export const createCategorySchema = Joi.object({
    body: Joi.object({
    name: Joi.string()
      .trim()
      .min(2)
      .max(59)
      .pattern(/^[a-zA-Z0-9&/-]+(?: [a-zA-Z0-9&/-]+)*$/)
      .required()
      .messages({
        "string.base": "Category name must be a string",
        "string.min": "Too short category name",
        "string.max": "Too long category name",
        "string.empty": "Category name is required",
        "string.pattern.base": "Category name contains invalid characters",
        "any.required": "Category name is required",
      }),
  }).required(),

  file: 
  imageValidation
  .required()
    .messages({
      "any.required": "Category image is required",
    }),
}).unknown(true);

    export const getCategoryByIdSchema = Joi.object({
    params:Joi.object({
        id:idValidation
        .required()
        .messages({
            "any.required":"Category id is required",
        })
    }).required()
    }).unknown(true)

    export const getCategoryByNameSchema = Joi.object({
    params:Joi.object({
       name:Joi.string()  
        .trim()
        .min(2)
        .max(59)
        .pattern(/^[a-zA-Z0-9&/-]+(?: [a-zA-Z0-9&/-]+)*$/)
        .required()
        .messages({
        "string.base":"Category name must be a string",
        "string.min":"Too short category name",
        "string.max":"Too long category name",
        "string.pattern.base": "Category name contains invalid characters",
        "string.empty":"Category name is required",
        "any.required":"Category name is required",
        }),
    }).required()
    }).unknown(true)

    export const getCategoryBySlugSchema = Joi.object({
    params:Joi.object({
    slug:Joi.string()
      .trim()
      .lowercase()
      .min(2)
      .max(100)
      .pattern(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
      .required()
      .messages({
        "string.base": "Slug must be a string",
        "string.empty": "Slug is required",
        "string.min": "Slug is too short",
        "string.max": "Slug is too long",
        "string.pattern.base": "Slug must be valid kebab-case (e.g. electronics-devices)",
        "any.required": "Slug is required"
      })
    
    }).required()
    }).unknown(true)

    export const deleteCategoryByIdSchema =  Joi.object({
    params:Joi.object({
        id:idValidation
        .required()
        .messages({
            "any.required":"Category id is required",
        })
    }).required()
    }).unknown(true)

    export const updateCategoryByIdSchema = Joi.object({
        params:Joi.object({
        id:idValidation
        .required()
        .messages({
            "any.required":"Category id is required",
        })
        }).required(),

        body :Joi.object({

        name: Joi.string()
        .trim()
        .pattern(/^[a-zA-Z0-9\u0621-\u064A]+(?: [a-zA-Z0-9\u0621-\u064A]+)*$/)
        .min(2)
        .max(59)
        .messages({
        "string.base":"Category name must be a string",
        "string.min":"Too short category name",
        "string.max":"Too long category name",
        "string.empty":"Category name cannot be empty",
        "string.pattern.base": "Category name contains invalid characters",
        }),
        }).optional(),
        
  file: imageValidation.optional()

    }).unknown(true)
    .or("file","body.name").
    messages({
      "object.missing":"At least one field (name or image) must be provided for update"
    });
