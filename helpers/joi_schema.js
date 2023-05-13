const DateExtension = require("@joi/date");
const Joi = require("joi");
const joi = Joi.extend(DateExtension);

 const email = joi.string().pattern(new RegExp('gmail.com$')).required().messages({
  "string.empty": `email is not allowed to be empty`,
});
 const password = joi.string().min(6).required()

const post_title = joi.string().required();
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
const post_id = joi.string().required().messages({
  "string.empty": `post_id is not allowed to be empty`,
});
const cate_id = joi.string().required().messages({
  "string.empty": `cate_id is not allowed to be empty`,
});
const project_id = joi.string().required().messages({
  "string.empty": `project_id is not allowed to be empty`,
});
const major_id = joi.string().required().messages({
  "string.empty": `major_id is not allowed to be empty`,
});
const user_id = joi.string().required().messages({
  "string.empty": `major_id is not allowed to be empty`,
});
const post_ids = joi.array().required();
const user_ids = joi.array().required().messages({
  'any.required': 'user_ids are required'
});
const refresh_token = joi.string().required().messages({
  "string.empty": `refresh_token is not allowed to be empty`,
});
const name = joi.string();
const project_name = joi.string().required();
const project_ids = joi.array().required().messages({
  'any.required': 'project_ids are required'
});
const major_name = joi.string();
const major_ids = joi.array().required().messages({
  'any.required': 'major_ids are required'
});
const title = joi.string().required().messages({
  "string.empty": `title is not allowed to be empty`,
});
const body = joi.string().required().messages({
  "string.empty": `body is not allowed to be empty`,
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
const application_id = joi.string().required().messages({
  "string.empty": `application_id is not allowed to be empty`,
});
const application_ids = joi.array().required().messages({
  'any.required': 'cate_ids are required'
});

const deliverable_id = joi.string().required().messages({
  "string.empty": `deliverable_id is not allowed to be empty`,
});


module.exports = {
  name,
  email,
  post_id,
  post_title,
  description,
  time_start,
  time_end,
  price,
  post_ids,
  user_id,
  cate_id,
  project_id,
  project_ids,
  major_id,
  user_ids,
  refresh_token,
  project_name,
  major_name,
  major_ids,
  title,
  body,
  device_token,
  cate_name,
  cate_ids,
  user_name, 
  avatar,
  role_id,
  url,
  application_id, 
  application_ids,
  deliverable_id,
  password,
  
};
