const db = require("../models");
const { Op } = require("sequelize");
const redisClient = require("../config/redis_config");

const getAllCities = (
  { city_name, ...query },
  role_name
) =>
  new Promise(async (resolve, reject) => {
    try {
      const queries = { raw: true, nest: true };
      queries.order = [['updatedAt', 'DESC']];
      if (city_name)
        query.city_name = { [Op.substring]: city_name };
      if (role_name !== "Admin") {
        query.status = { [Op.notIn]: ['Deactive'] };
      }
      const cities = await db.City.findAndCountAll({
        where: query,
        ...queries,
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      });

      if (role_name !== "Admin") {
        redisClient.setEx(`cities_${city_name}`, 3600, JSON.stringify(cities));
      } else {
        redisClient.setEx(`admin_cities_${city_name}`, 3600, JSON.stringify(cities));
      }
      resolve({
        msg: cities ? `Got cities` : "Cannot find cities",
        cities: cities,
      });
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });


const createCity = (body) =>
  new Promise(async (resolve, reject) => {
    try {
      const city = await db.City.findOrCreate({
        where: { city_name: body?.city_name },
        defaults: {
          ...body,
        },
      });
      resolve({
        msg: city[1]
          ? "Create new city successfully"
          : "Cannot create new city",
      });
    } catch (error) {
      reject(error);
    }
  });

const updateCity = ({ city_id, ...body }) =>
  new Promise(async (resolve, reject) => {
    try {
      const cities = await db.City.update(body, {
        where: { city_id },
      });
      resolve({
        msg:
          cities[0] > 0
            ? `${cities[0]} city update`
            : "Cannot update city/ city_id not found",
      });

    } catch (error) {
      reject(error.message);
    }
  });


const deleteCity = (city_ids, city_id) =>
  new Promise(async (resolve, reject) => {
    try {
      const cities = await db.City.update(
        { status: "Deactive" },
        {
          where: { city_id: city_ids },
        }
      );
      resolve({
        msg:
          cities > 0
            ? `${cities} city delete`
            : "Cannot delete city/ city_id not found",
      });
    } catch (error) {
      reject(error);
    }
  });

const getCityById = (city_id) =>
  new Promise(async (resolve, reject) => {
    try {
      const city = await db.City.findOne({
        where: { city_id: city_id },
        raw: true,
        nest: true,
        attributes: {
          exclude: [
            "createdAt",
            "updatedAt",
          ],
        },
      });
      resolve({
        msg: city ? `Got city` : "Cannot find city",
        city: city,
      });
    } catch (error) {
      reject(error);
    }
  });

module.exports = {
  updateCity,
  deleteCity,
  getCityById,
  createCity,
  getAllCities,

};

