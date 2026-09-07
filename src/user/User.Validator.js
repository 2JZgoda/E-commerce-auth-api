import Joi from "joi"





//*Base Validators
const idValidation = Joi.string()
.hex()
.length(24)
.messages({
    "string.hex":"id is invalid",
    "string.length": "id must be 24 characters",
    "string.empty": "ID is required",
})

const nameValidation = Joi.string()
.trim()
.min(2)
.max(59)
.pattern(/^[a-zA-Z\u0600-\u06FF\s]+$/)
.messages({
    'string.pattern.base': 'Name must contain English or Arabic letters and spaces only',
    "string.base":"Name must be a string",
    "string.min":"Name must be at least 2 characters",
    "string.max":"Name cannot exceed 59 characters",
    "string.empty": "Name cannot be empty",
})

const usernameValidation = Joi.string()
.trim()
.min(1)
.max(59)
.pattern(/^[a-zA-Z0-9._]+$/)
.messages({
    "string.base": "Username must be a string",
    "string.min": "Username must be at least 1 characters",
    "string.max": "Username cannot exceed 59 characters",
    "string.pattern.base": "Username can only contain letters, numbers, underscores, and dots with no spaces",
        "string.empty": "Username cannot be empty",
});

const emailValidation = Joi.string()
.trim()
.email({ tlds: { allow: false } })
.messages({
    "string.base": "Email must be a string",
    "string.email": "Invalid email address format",
    "string.empty": "Email address cannot be empty",
})

const passwordValidation = Joi.string()
.min(8)
.messages({
    "string.min":"password must be atleast 8 characters",
    "string.base":"password must be a string",
})

const profilePicValidation = Joi.string()
  .trim()
  .uri()
  .allow(null, "")
  .messages({
    "string.base": "Profile picture must be a string",
    "string.uri": "Profile picture must be a valid HTTP/HTTPS URL",
});






//*Validators Schema
export const createUserSchema = Joi.object({
    body: Joi.object({
        name: nameValidation
        .required()
        .messages({
            "any.required":"name is required"
        }),

        username:usernameValidation
        .required()
        .messages({
            "any.required":"username is required"

        }),

        email:emailValidation
        .required()
        .messages({
            "any.required":"email is required"
        }),

        password:passwordValidation
        .required(  )
        .messages({
            //*notice
            "string.empty":"password is required",
            "any.required":"password is required"
        })


    }).required()
}).unknown(true)

export const deleteUserByIdSchema = Joi.object({
    params:Joi.object({
        id:idValidation
        .required()
        .messages({
            "any.required":"id is required"
        })
    }).required()
}).unknown(true)

export const getUserByIdSchema = Joi.object({
    params:Joi.object({
        id:idValidation
        .required()
        .messages({
            "any.required":"id is required"
        })
    }).required()
}).unknown(true)

export const getUserByUsernameSchema = Joi.object({
    params:Joi.object({
    username:usernameValidation
    .required()
    .messages({
        "any.required":"username is required"
    })
    }).required()
}).unknown(true)

export const updateUserSchema = Joi.object({
    params:Joi.object({
        id:idValidation
        .required()
        .messages({
            "any.required":"id is required"
        })
    }).required(),

    body:Joi.object({
        name:nameValidation,
        email:emailValidation,
        profilePic:profilePicValidation,
        username:usernameValidation
    }).min(1)
}).unknown(true)