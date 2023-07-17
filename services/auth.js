require("dotenv").config();
const db = require("../models");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');

const hashPassword = password => bcrypt.hashSync(password, bcrypt.genSaltSync(8));

const register = ({ email, password, confirm_pass, role_id }) => new Promise(async (resolve, reject) => {
  try {
    if (confirm_pass !== password) {
      resolve({
        mes: 'Confirm password does not match with password',
      })
    } else {
      const response = await db.User.findOrCreate({
        where: { email },
        defaults: {
          user_name: email,
          password: hashPassword(password),
          email,
          avatar: 'https://t3.ftcdn.net/jpg/01/18/01/98/360_F_118019822_6CKXP6rXmVhDOzbXZlLqEM2ya4HhYzSV.jpg',
          role_id: role_id ? role_id : "58c10546-5d71-47a6-842e-84f5d2f72ec3",
        }
      })
      resolve({
        mes: response[1] ? 'Register successfully' : 'Email has already used',
      })
    }

  } catch (error) {
    reject(error)
  }
})

const login = ({ email, password }) => new Promise(async (resolve, reject) => {
  try {
    const response = await db.User.findOne({
      where: { email },
      raw: true,
      nest: true,
      attributes: {
        exclude: [
          "role_id",
          "status",
          "createdAt",
          "updatedAt",
          "major_id",
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
    })
    const isChecked = response && bcrypt.compareSync(password, response.password);
    const accessToken = isChecked
      ? jwt.sign({ user_id: response.user_id, email: response.email, role_name: response.user_role.role_name }, process.env.JWT_SECRET, { expiresIn: '1h' })
      : null
    // JWT_SECRET_REFRESH_TOKEN
    const refreshToken = isChecked
      ? jwt.sign({ id: response.id }, process.env.JWT_SECRET_REFRESH, { expiresIn: '1d' })
      : null
    resolve({
      mes: accessToken ? 'Login is successfully' : response ? 'Password is wrong' : 'Not found account',
      'access_token': accessToken ? `${accessToken}` : accessToken,
      'refresh_token': refreshToken,
      user: isChecked ? response : null
    })

    if (refreshToken) {
      await db.Student.update(
        {
          refresh_token: refreshToken,
        },
        { where: { student_id: response[0].student_id } }
      );
    }
  } catch (error) {
    reject(error)
  }
})

const loginGoogle = ({ name, picture, user_id, email }) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.User.findOrCreate({
        where: { email },
        raw: true,
        nest: true,
        defaults: {
          user_id: user_id,
          user_name: name,
          email: email,
          avatar: picture,
          role_id: "58c10546-5d71-47a6-842e-84f5d2f72ec3",
        },
      });
      // console.log("0",response);
      // console.log("1", response[0]);
      const user = await db.User.findOne({
        where: { email: email },
        raw: true,
        nest: true,
        attributes: {
          exclude: [
            "role_id",
            "status",
            "createdAt",
            "updatedAt",
            "major_id",
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

      const [accessToken, refreshToken] = await Promise.all([
        jwt.sign(
          {
            user_id: response[0].user_id,
            email: response[0].email,
            role_name: user.user_role.role_name,
          },
          process.env.JWT_SECRET,
          { expiresIn: "1h" }
        ),
        jwt.sign(
          { user_id: response[0].user_id },
          process.env.JWT_SECRET_REFRESH,
          { expiresIn: "5d" }
        ),
      ]);

      if (refreshToken) {
        await db.User.update(
          {
            refresh_token: refreshToken,
          },
          { where: { user_id: response[0].user_id } }
        );
      }

      resolve({
        mes: "Login successfully",
        access_token: accessToken ? `${accessToken}` : accessToken,
        refresh_token: refreshToken,
        user: user,
      });
      
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });

const refreshAccessToken = (refresh_token) =>
  new Promise(async (resolve, reject) => {
    try {
      const user = await db.User.findOne({
        where: { refresh_token },
        raw: true,
        nest: true,
        attributes: {
          exclude: ["role_id", "status", "createdAt", "updatedAt", "major_id"],
        },
        include: [
          {
            model: db.Role,
            as: "user_role",
            attributes: ["role_name"],
          },
        ],
      });
      if (user) {
        jwt.verify(refresh_token, process.env.JWT_SECRET_REFRESH, (err) => {
          if (err) {
            resolve({
              mes: "Refresh token expired",
            });
          } else {
            const accessToken = jwt.sign(
              {
                user_id: user.user_id,
                email: user.email,
                role_name: user.user_role.role_name,
              },
              process.env.JWT_SECRET,
              { expiresIn: "1h" }
            );
            resolve({
              mes: accessToken
                ? "Create refresh token successfully"
                : "Create refresh token unsuccessfully",
              access_token: accessToken ? `${accessToken}` : accessToken,
              refresh_token: refresh_token,
            });
          }
        });
      }
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });

const logout = (user_id) =>
  new Promise(async (resolve, reject) => {
    try {
      const user = await db.User.findOne({
        where: { user_id },
        raw: true,
        nest: true,
        attributes: {
          exclude: ["role_id", "status", "createdAt", "updatedAt", "major_id"],
        },
        include: [
          {
            model: db.Role,
            as: "user_role",
            attributes: ["role_name"],
          },
        ],
      });

      const response = await db.User.update(
        {
          refresh_token: null,
        },
        { where: { user_id: user.user_id } }
      );
      resolve({
        mes: "Logout successfully"
      });
    } catch (error) {
      reject(error);
    }
  });

module.exports = { refreshAccessToken, logout, login, register, loginGoogle };
