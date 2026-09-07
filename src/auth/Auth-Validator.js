import Joi from "joi";



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
.lowercase()
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
.email()
.lowercase()
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






//*validators schema
export const registerUserSchema = Joi.object({
    body:Joi.object({
        name:nameValidation
        .required()
        .messages({
            "any.required" : "name is required"
        }),
        username:usernameValidation
        .required()
        .messages({
            "any.required":"usernaem is required"
        }),
        email:emailValidation
        .required()
        .messages({
            "any.required":"email is required"
        }),
        password:passwordValidation
        .required()
        .messages({
            "any.required":"password is required"
        })
    }).required()
}).unknown(true)


export const loginUserSchema = Joi.object({
    body:Joi.object({
        username:usernameValidation
        .required()
        .messages({
            "any.required":"usernaem is required"
        }),
        password:passwordValidation
        .required()
        .messages({
            "any.required":"password is required"
        })
    }).required()
}).unknown(true)


export const changePasswordSchema = Joi.object({
    body:Joi.object({
        oldPassword:passwordValidation
        .required()
        .messages({
            "any.required":"old password is required"
        }),
        newPassword:passwordValidation
        .required()
        .messages({
            "any.required":"new password is required"
        })
    }).required()
}).unknown(true)


export const logoutSchema = Joi.object({
  cookies: Joi.object({
    refreshToken: Joi.string()
      .trim()
      .required()
      .optional()
      .messages({
        "string.base": "Refresh token must be a string",
        "string.empty": "Refresh token cannot be empty",
        "any.required": "Refresh token is required"
      })
  }).required()
}).unknown(true);


export const refreshTokenSchema = Joi.object({
cookies: Joi.object({
    refreshToken: Joi.string()
      .trim()
      .required()
      .messages({
        "string.base": "Refresh token must be a string",
        "string.empty": "Refresh token cannot be empty",
        "any.required": "Refresh token is required"
      })
  }).required()

}).unknown(true);


export const resendOTPSchema = Joi.object({
    body: Joi.object({
    email: Joi.string()
    .email()
    .required()
    .messages({
    'string.base': 'Email must be a text string.',
    'string.email': 'Please provide a valid email address.',
    'any.required': 'Email is a required field.',
    })
})
})