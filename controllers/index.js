const {refreshAccessToken, logout, login, register } = require("./auth");
const {updateUser, deleteUser, getUserById, createUser, getAllUsers, updateProfile} = require("./user");
const {updateCity, deleteCity, getCityById, createCity, getAllCities} = require("./city");
const {updateStore, deleteStore, getStoreById, createStore, getAllStores,} = require("./store");
const {getAllRoles} = require("./role");

module.exports = {
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
  
};
