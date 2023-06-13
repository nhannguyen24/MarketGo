const {refreshAccessToken, logout, login, register, loginGoogle } = require("./auth");
const {updateUser, deleteUser, getUserById, createUser, getAllUsers, updateProfile} = require("./user");
const {updateCity, deleteCity, getCityById, createCity, getAllCities} = require("./city");
const {updateStore, deleteStore, getStoreById, createStore, getAllStores,} = require("./store");
const {getAllRoles} = require("./role");
const { updateIngredient, deleteIngredient, getIngredientById, createIngredient, getAllIngredients, } = require("./ingredient");
const { updateFood, deleteFood, getFoodById, createFood, getAllFoods, } = require("./food");
const { updateCategory, deleteCategory, getCategoryById, createCategory, getAllCategories, } = require("./category");
const { updateCategoryDetail, deleteCategoryDetail, getCategoryDetailById, createCategoryDetail, getAllCategoryDetail, } = require("./category_detail");
const {createOrderDetail, getOrderDetailByOrderId,} = require("./order_detail");
const {getOrdersByUserId,} = require("./order");
const {updateStep, deleteStep, createStep,} = require("./guild_step");
const {payment, stripeWebhook} = require('./payment');

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
  updateCategory,
  deleteCategory,
  getCategoryById,
  createCategory,
  getAllCategories,
  updateCategoryDetail,
  deleteCategoryDetail,
  getCategoryDetailById,
  createCategoryDetail,
  getAllCategoryDetail,
  createOrderDetail,
  updateStep, 
  deleteStep, 
  createStep,
  payment, stripeWebhook, getOrdersByUserId, getOrderDetailByOrderId,
};
