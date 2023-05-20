const {refreshAccessToken, logout, login, register, loginGoogle } = require("./auth");
const {updateUser, deleteUser, getUserById, createUser, getAllUsers, updateProfile} = require("./user");
const {updateCity, deleteCity, getCityById, createCity, getAllCities} = require("./city");
const {updateStore, deleteStore, getStoreById, createStore, getAllStores,} = require("./store");
const {getAllRoles} = require("./role");
const { updateIngredient, deleteIngredient, getIngredientById, createIngredient, getAllIngredients, } = require("./ingredient");
const { updateFood, deleteFood, getFoodById, createFood, getAllFoods, } = require("./food");

module.exports = {
  loginGoogle,
  logout,
  refreshAccessToken,
  login, 
  register,
  updateUser, 
  deleteUser, 
  getUserById, 
  createUser,
  getAllUsers,
  updateProfile,
  updateCity, 
  deleteCity, 
  getCityById, 
  createCity, 
  getAllCities,
  updateStore,
  deleteStore,
  getStoreById,
  createStore,
  getAllStores,
  getAllRoles,
  updateIngredient,
  deleteIngredient,
  getIngredientById,
  createIngredient,
  getAllIngredients,
  updateFood,
  deleteFood,
  getFoodById,
  createFood,
  getAllFoods,

};
