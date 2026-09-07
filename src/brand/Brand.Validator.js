import Joi from "joi"


    const idValidation = Joi.string().hex().length(24).messages({
        "string.hex":"id is invalid",
        "string.length": "id must be 24 characters",
    })

    const nameValidation = Joi.string()  
                .trim()
                .min(2)
                .max(50)
                .pattern(/^[a-zA-Z0-9\u0621-\u064A]+(?:[ '&-][a-zA-Z0-9\u0621-\u064A]+)*$/)                .messages({
                "string.base":"Brand name must be a string",
                "string.min":"Too short Brand name",
                "string.max":"Too long Brand name",
                "string.empty":"Brand name is required",
                "string.pattern.base": "Brand name contains invalid characters"
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

export const createBrandSchema = Joi.object({
    body:Joi.object({
        name:nameValidation
                .required()
                .messages({
                "any.required":"Brand name is required",
                }),
    }).required(),

    file: imageValidation
    .required()
    .messages({
            "any.required":"category image is required"
        })


}).unknown(true)

export const getBrandByIdSchema = Joi.object({
    params:Joi.object({
        id:idValidation
        .required()
        .messages({
            "any.required":"Brand id is required"
        })
    }).required()
}).unknown(true)

export const getBrandByBrandNameSchema = Joi.object({
    params:Joi.object({
           name:nameValidation
                .required()
                .messages({
                "any.required":"Brand name is required",
                }),
    }).required()
}).unknown(true)

export const deleteBrandByIdSchema = Joi.object({
    params:Joi.object({
        id:idValidation
        .required()
        .messages({
            "any.required":"Brand id is required"
        })
    }).required()
}).unknown(true)

export const updateBrandSchema = Joi.object({
    params:Joi.object({
        id:idValidation
        .required()
        .messages({
            "any.required":"Brand id is required"
        })
    }).required(),


    body:Joi.object({
         name:nameValidation
                .messages({
                "any.required":"Brand name is required",
                }),
        
    }).optional(),

       file: imageValidation.optional(),
}).unknown(true)
.or("file","body.name").
    messages({
      "object.missing":"At least one field (name or image) must be provided for update"
    });
