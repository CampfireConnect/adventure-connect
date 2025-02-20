const mongoose = require("mongoose");
const bcrypt = require("bcrypt");


const usersSchema = new mongoose.Schema({
  name: { type: String }, //why not required
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  zipCode: { type: Number, required: true },
  interests: { type: Array },
  images: { type: Array },
  bio: { type: String },
  iLiked: [{ type: String, unique: true }], //list of users that the current user has liked 
  likedBy: [{ type: String}], //list of users that have liked the current user 
  matches: [{ type: String }],
});

usersSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    next();
  } catch (error) {
    console.log('error hashing password');
    return next(error);
  }
});

usersSchema.methods.comparePassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    throw error;
  }
};

const Users = mongoose.model("Users", usersSchema);

module.exports = Users;
