const db = require("../models");
const { Op } = require("sequelize");
const redisClient = require("../config/redis_config");
const bcrypt = require('bcryptjs');

const hashPassword = password => bcrypt.hashSync(password, bcrypt.genSaltSync(8));

// const getAllUser = () =>
//   new Promise(async (resolve, reject) => {
//     try {
//       redisClient.get("users", async (error, user) => {
//         if (error) console.error(error);
//         if (user != null) {
//           resolve({
//             msg: user ? `Got user` : "Cannot find user",
//             user: JSON.parse(user),
//           });
//         } else {
//           const users = await db.User.findAndCountAll({
//             raw: true,
//             nest: true,
//             where: {
//               status: {
//                 [Op.ne]: "Deactive",
//               }
//             },
//             order: [
//               ['updatedAt', 'DESC']
//             ],
//             attributes: {
//               exclude: [
//                 "role_id",
//                 "major_id",
//                 "createAt",
//                 "updateAt",
//                 "refresh_token",
//               ],
//             },
//             include: [
//               {
//                 model: db.Role,
//                 as: "user_role",
//                 attributes: ["role_id", "role_name"],
//               }
//             ],
//           });
//           redisClient.setEx("users", 3600, JSON.stringify(users));

//           resolve({
//             msg: users ? `Got user` : "Cannot find user",
//             users: users,
//           });
//         }
//       });
//     } catch (error) {
//       reject(error);
//     }
//   });

const getAllUserPaging = ({ page, limit, order, user_name, ...query}) =>
  new Promise(async (resolve, reject) => {
    try {
      redisClient.get(`user_paging_${page}_${limit}_${order}_${user_name}`, async (error, user_paging) => {
        if (error) console.error(error);
        if (user_paging != null) {
          resolve({
            msg: user_paging ? `Got user` : "Cannot find user",
            user_paging: JSON.parse(user_paging),
          });
        } else {
          const queries = { raw: true, nest: true };
          const offset = !page || +page <= 1 ? 0 : +page - 1;
          const flimit = +limit || +process.env.LIMIT_POST;
          queries.offset = offset * flimit;
          queries.limit = flimit;
          if (order) queries.order = [order];
          if (user_name) query.user_name = { [Op.substring]: user_name };
          // query.status = { [Op.ne]: "Deactive" };

          const users = await db.User.findAndCountAll({
            where: query,
            ...queries,
            attributes: {
              exclude: [
                "role_id",
                "major_id",
                "createAt",
                "updateAt",
                "refresh_token",
              ],
            },
            include: [
              {
                model: db.Role,
                as: "user_role",
                attributes: ["role_id", "role_name"],
              },
            ],
          });
          redisClient.setEx(`user_paging_${page}_${limit}_${order}_${user_name}`, 3600, JSON.stringify(users));

          resolve({
            msg: users ? `Got user` : "Cannot find user",
            users: users,
          });
        }
      });
    } catch (error) {
      reject(error);
    }
  });


const createUser = ({password, ...body}) =>
  new Promise(async (resolve, reject) => {
    try {
      console.log(body);
      const user = await db.User.findOrCreate({
        where: { email: body?.email },
        defaults: {
          password: hashPassword(password),
          ...body,
        },
      });
      resolve({
        msg: user[1]
          ? "Create new user successfully"
          : "Cannot create new user/ Email already exists",
      });
    } catch (error) {
      reject(error);
    }
  });

const updateUser = ({ user_id, ...body }) =>
  new Promise(async (resolve, reject) => {
    try {
      const users = await db.User.update(body, {
        where: { user_id },
      });
      resolve({
        msg:
          users[0] > 0
            ? `${users[0]} user update`
            : "Cannot update user/ user_id not found",
      });
      redisClient.del('users');
    } catch (error) {
      reject(error.message);
    }
  });

  const updateProfile = (body, user_id) =>
  new Promise(async (resolve, reject) => {
    try {
      if (body.user_id !== user_id) {
        resolve({
          msg: "Can't update other people's account"
        });
      } else {
        const users = await db.User.update(body, {
          where: { user_id: user_id},
        });
        resolve({
          msg:
            users[0] > 0
              ? "Update profile successfully"
              : "Cannot update user/ user_id not found",
        });
      }
    } catch (error) {
      reject(error.message);
    }
  });

const deleteUser = (user_ids, user_id) =>
  new Promise(async (resolve, reject) => {
    try {
      if (user_ids.includes(user_id)) {
        resolve({
          msg: "Cannot delete user/ Account is in use",
        });
      } else {
        const users = await db.User.update(
          { status: "Deactive" },
          {
            where: { user_id: user_ids },
          }
        );
        resolve({
          msg:
            users > 0
              ? `${users} user delete`
              : "Cannot delete user/ user_id not found",
        });
        redisClient.del('users');
      }
    } catch (error) {
      reject(error);
    }
  });

const getUserById = (user_id) =>
  new Promise(async (resolve, reject) => {
    try {
      const user = await db.User.findOne({
        where: { user_id: user_id },
        raw: true,
        nest: true,
        attributes: {
          exclude: [
            "role_id",
            "major_id",
            "createdAt",
            "updatedAt",
            "refresh_token",
          ],
        },
        include: [
          {
            model: db.Role,
            as: "user_role",
            attributes: ["role_id", "role_name"],
          }
        ],
      });
      if (user) {
        resolve({
          user: user,
        });
      } else {
        resolve({
          msg: `Cannot find user with id: ${user_id}`,
        });
      }
    } catch (error) {
      reject(error);
    }
  });

module.exports = {
  updateUser,
  deleteUser,
  getUserById,
  createUser,
  getAllUserPaging,
  updateProfile,

};

