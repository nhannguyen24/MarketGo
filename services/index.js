const {refreshAccessToken, logout, login, register}= require("./auth");
const {getAllUser, updateUser, deleteUser, getUserById, createUser, getAllUserPaging, updateProfile} = require("./user");

module.exports = {
  logout,
  refreshAccessToken,
  login, 
  register,
  getAllUser, 
  updateUser, 
  deleteUser, 
  getUserById, 
  createUser, 
  getAllUserPaging, 
  updateProfile,
  
};
