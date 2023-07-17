const DateExtension = require("@joi/date");
const Joi = require("joi");
const joi = Joi.extend(DateExtension);

 const email = joi.string().pattern(new RegExp('gmail.com$')).required().messages({
  "string.empty": `email is not allowed to be empty`,
});
 const password = joi.string().min(6).required()

const description = joi.string().required().messages({
  "string.empty": `description is not allowed to be empty`,
});
const time_start = joi.date().format("YYYY-MM-DD").utc().messages({
  "date.format": `time_start must be in YYYY-MM-DD format`,
  "any.required": `time_start is a required field`,
});
const time_end = joi.date().format("YYYY-MM-DD").utc().messages({
  "date.format": `time_end must be in YYYY-MM-DD format`,
  "any.required": `time_end is a required field`,
});
const price = joi.number().required().messages({
  "number.base": `price must be a number`,
});
const store_id = joi.string().required().messages({
  "string.empty": `store_id is not allowed to be empty`,
});

const store_ids = joi.array().required().messages({
  'any.required': 'store_ids are required'
});

const cate_id = joi.string().required().messages({
  "string.empty": `cate_id is not allowed to be empty`,
});

const user_id = joi.string().required().messages({
  "string.empty": `user_id is not allowed to be empty`,
});

const city_id = joi.string().required().messages({
  "string.empty": `city_id is not allowed to be empty`,
});

const city_ids = joi.array().required().messages({
  'any.required': 'city_ids are required'
});

const blog_id = joi.string().required().messages({
  "string.empty": `blog_id is not allowed to be empty`,
});

const blog_ids = joi.array().required().messages({
  'any.required': 'blog_ids are required'
});

const category_id = joi.string().required().messages({
  "string.empty": `category_id is not allowed to be empty`,
});

const category_ids = joi.array().required().messages({
  'any.required': 'category_ids are required'
});

const cate_detail_id = joi.string().required().messages({
  "string.empty": `cate_detail_id is not allowed to be empty`,
});

const cate_detail_ids = joi.array().required().messages({
  'any.required': 'cate_detail_ids are required'
});

const recipe_id = joi.string().required().messages({
  "string.empty": `recipe_id is not allowed to be empty`,
});

const recipe_ids = joi.array().required().messages({
  'any.required': 'recipe_ids are required'
});

const food_id = joi.string().required().messages({
  "string.empty": `food_id is not allowed to be empty`,
});

const food_ids = joi.array().required().messages({
  'any.required': 'food_ids are required'
});

const step_id = joi.string().required().messages({
  "string.empty": `step_id is not allowed to be empty`,
});

const step_ids = joi.array().required().messages({
  'any.required': 'step_ids are required'
});

const ingredient_id = joi.string().required().messages({
  "string.empty": `ingredient_id is not allowed to be empty`,
});

const ingredient_ids = joi.array().required().messages({
  'any.required': 'ingredient_ids are required'
});

const user_ids = joi.array().required().messages({
  'any.required': 'user_ids are required'
});

const refresh_token = joi.string().required().messages({
  "string.empty": `refresh_token is not allowed to be empty`,
});

const device_token = joi.string().required().messages({
  "string.empty": `device_token is not allowed to be empty`,
});

const cate_name = joi.string().required().messages({
  "string.empty": `cate_name is not allowed to be empty`,
});
const cate_ids = joi.array().required().messages({
  'any.required': 'cate_ids are required'
});

const user_name = joi.string().required().messages({
  "string.empty": `user_name is not allowed to be empty`,
});

const avatar = joi.string().required().messages({
  "string.empty": `avatar is not allowed to be empty`,
});

const role_id = joi.string().required().messages({
  "string.empty": `role_id is not allowed to be empty`,
});

const url = joi.string().required().messages({
  "string.empty": `url is not allowed to be empty`,
});

module.exports = {
  email,
  description,
  time_start,
  time_end,
  price,
  user_id,
  cate_id,
  user_ids,
  refresh_token,
  device_token,
  cate_name,
  cate_ids,
  user_name, 
  avatar,
  role_id,
  url,
  password,
  city_id,
  city_ids,
  store_id, 
  store_ids,
  ingredient_id,
  ingredient_ids,
  category_id, 
  category_ids,
  cate_detail_id,
  cate_detail_ids,
  recipe_id,
  recipe_ids,
  food_id, 
  food_ids,
  step_id, 
  step_ids,
  blog_id,
  blog_ids,

};
