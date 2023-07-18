const db = require("../models");
const { Op } = require("sequelize");
const redisClient = require("../config/redis_config");

const getAllBlogs = (
    { page, limit, order, title, user_id, ...query },
    role_name
) =>
    new Promise(async (resolve, reject) => {
        try {
            redisClient.get(`blogs_${page}_${limit}_${order}_${title}_${user_id}`, async (error, blog) => {
                if (error) console.error(error);
                if (blog != null && blog != "" && role_name != 'Admin') {
                    resolve({
                        msg: "Got blogs",
                        blogs: JSON.parse(blog),
                    });
                } else {
                    redisClient.get(`admin_blogs_${page}_${limit}_${order}_${title}_${user_id}`, async (error, adminBlog) => {
                        if (adminBlog != null && adminBlog != "") {
                            resolve({
                                msg: "Got blogs",
                                blogs: JSON.parse(adminBlog),
                            });
                        } else {
                            const queries = { nest: true };
                            const offset = !page || +page <= 1 ? 0 : +page - 1;
                            const flimit = +limit || +process.env.LIMIT_POST;
                            queries.offset = offset * flimit;
                            queries.limit = flimit;
                            if (order) queries.order = [order];
                            else queries.order = [['updatedAt', 'DESC']];
                            if (title) query.title = { [Op.substring]: title };
                            if (user_id) query.user_id = { [Op.eq]: user_id };
                            if (role_name !== "Admin") {
                                query.status = { [Op.notIn]: ['Deactive'] };
                            }
                            const blogs = await db.Blog.findAll({
                                where: query,
                                ...queries,
                                attributes: {
                                    exclude: ["user_id", "updatedAt"],
                                },
                                include: [
                                    {
                                        model: db.User,
                                        as: "blog_user",
                                        attributes: {
                                            exclude: [
                                                "createdAt",
                                                "updatedAt",
                                                "status",
                                            ],
                                        },
                                    }
                                ],
                            });

                            if (role_name !== "Admin") {
                                redisClient.setEx(`blogs_${page}_${limit}_${order}_${order}_${title}_${user_id}`, 3600, JSON.stringify(blogs));
                            } else {
                                redisClient.setEx(`admin_blogs_${page}_${limit}_${order}_${order}_${title}_${user_id}`, 3600, JSON.stringify(blogs));
                            }
                            resolve({
                                msg: blogs ? "Got blogs" : "Cannot find blogs",
                                blogs: blogs,
                            });
                        }
                    })
                }
            })
        } catch (error) {
            console.log(error);
            reject(error);
        }
    });


const createBlog = ({ title, ...body }) =>
    new Promise(async (resolve, reject) => {
        try {
            const blog = await db.Blog.findOrCreate({
                where: {
                    title: title
                },
                defaults: {
                    title: title,
                    ...body,
                },
            });

            resolve({
                msg: blog[1]
                    ? "Create new blog successfully"
                    : "Cannot create new blog/Blog already exists",
            });

            redisClient.keys('*blogs_*', (error, keys) => {
                if (error) {
                    console.error('Error retrieving keys:', error);
                    return;
                }
                // Delete each key individually
                keys.forEach((key) => {
                    redisClient.del(key, (deleteError, reply) => {
                        if (deleteError) {
                            console.error(`Error deleting key ${key}:`, deleteError);
                        } else {
                            console.log(`Key ${key} deleted successfully`);
                        }
                    });
                });
            });

        } catch (error) {
            reject(error);
        }
    });

const updateBlog = ({ blog_id, ...body }) =>
    new Promise(async (resolve, reject) => {
        try {
            const blog = await db.Blog.findOne({
                where: {
                    title: body?.title,
                    blog_id: {
                        [Op.ne]: blog_id
                    }
                }
            });

            if (blog !== null) {
                resolve({
                    msg: "Blog name already exists"
                });
            } else {
                const blogs = await db.Blog.update(body, {
                    where: { blog_id },
                });

                resolve({
                    msg:
                        blogs[0] > 0
                            ? `${blogs[0]} blog update`
                            : "Cannot update blog/ blog_id not found",
                });

                redisClient.keys('*blogs_*', (error, keys) => {
                    if (error) {
                        console.error('Error retrieving keys:', error);
                        return;
                    }
                    // Delete each key individually
                    keys.forEach((key) => {
                        redisClient.del(key, (deleteError, reply) => {
                            if (deleteError) {
                                console.error(`Error deleting key ${key}:`, deleteError);
                            } else {
                                console.log(`Key ${key} deleted successfully`);
                            }
                        });
                    });
                });
            }
        } catch (error) {
            reject(error.message);
        }
    });


const deleteBlog = (blog_ids) =>
    new Promise(async (resolve, reject) => {
        try {
            const blogs = await db.Blog.update(
                { status: "Deactive" },
                {
                    where: { blog_id: blog_ids },
                }
            );
            resolve({
                msg:
                    blogs > 0
                        ? `${blogs} blog delete`
                        : "Cannot delete blog/ blog_id not found",
            });

            redisClient.keys('*blogs_*', (error, keys) => {
                if (error) {
                    console.error('Error retrieving keys:', error);
                    return;
                }
                // Delete each key individually
                keys.forEach((key) => {
                    redisClient.del(key, (deleteError, reply) => {
                        if (deleteError) {
                            console.error(`Error deleting key ${key}:`, deleteError);
                        } else {
                            console.log(`Key ${key} deleted successfully`);
                        }
                    });
                });
            });

        } catch (error) {
            reject(error);
        }
    });

const getBlogById = (blog_id) =>
    new Promise(async (resolve, reject) => {
        try {
            const blog = await db.Blog.findOne({
                where: { blog_id: blog_id },
                raw: true,
                nest: true,
                attributes: {
                    exclude: [
                        ["store_id", "promotion_id", "cate_detail_id", "updatedAt"]
                    ],
                },
                include: [
                    {
                        model: db.User,
                        as: "blog_user",
                        attributes: {
                            exclude: [
                                "createdAt",
                                "updatedAt",
                                "status",
                            ],
                        },
                    }
                ],
            });
            resolve({
                msg: blog ? `Got blog` : "Cannot find blog",
                blog: blog,
            });
        } catch (error) {
            reject(error);
        }
    });

module.exports = {
    updateBlog,
    deleteBlog,
    getBlogById,
    createBlog,
    getAllBlogs,

};

