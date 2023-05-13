const {refreshAccessToken, logout, login, register}= require("./auth");
const {updateUser, deleteUser, getUserById, createUser, getAllUserPaging, updateProfile} = require("./user");

module.exports = {
  logout,
  refreshAccessToken,
  login, 
  register,
  updateUser, 
  deleteUser, 
  getUserById, 
  createUser, 
  getAllUserPaging, 
  updateProfile,
  
};
