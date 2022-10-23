import Joi from 'joi';

const signupSchema = Joi.object({
  username: Joi.string().alphanum().min(2).max(25).required().messages({
    "string.empty": "A username is required",
    "string.min": "The username must be 2 to 25 characters long",
    "string.max": "The username must be 2 to 25 characters long",
    "string.alphanum": "The username can only contain numbers and letters",
    "any.required": "A username is required"
  }),
  password: Joi.string().required().min(5).max(25).messages({
    "string.empty": "A password is required",
    "string.min": "The password must be 5 to 25 characters long",
    "string.max": "The password must be 5 to 25 characters long",
    "any.required": "A password is required"
  })
})

export default signupSchema;