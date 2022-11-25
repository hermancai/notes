import Joi from "joi";

const signupSchema = Joi.object({
  username: Joi.string().alphanum().min(2).max(25).required().messages({
    "string.empty": "Username required",
    "string.min": "Username must be 2 to 25 characters long",
    "string.max": "Username must be 2 to 25 characters long",
    "string.alphanum": "Username can only contain numbers and letters",
    "any.required": "Username required",
  }),
  password: Joi.string().required().min(5).max(25).messages({
    "string.empty": "Password required",
    "string.min": "Password must be 5 to 25 characters long",
    "string.max": "Password must be 5 to 25 characters long",
    "any.required": "Password required",
  }),
});

export default signupSchema;
