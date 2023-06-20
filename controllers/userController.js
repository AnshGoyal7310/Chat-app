const bcrypt = require("bcryptjs");
const User = require("../models/user");

module.exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const userExist = await User.findOne({ username });
    if (userExist) {
      return res.json({ msg: "User already exists", status: "false" });
    }
    const emailExist = await User.findOne({ email });
    if (emailExist) {
      return res.json({ msg: "Email already exists", status: "false" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });
    await newUser.save();
    delete newUser.password;
    return res.json({ status: true, newUser });
  } catch (error) {
    next(error);
  }
};

module.exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const userExist = await User.findOne({ username });
    if (!userExist) {
      return res.json({ msg: "User does not exist", status: false });
    }
    const isPasswordMatch = await bcrypt.compare(password, userExist.password);
    if (!isPasswordMatch) {
      return res.json({ msg: "Invalid password", status: false });
    }
    delete userExist.password;
    return res.json({ status: true, userExist });
  } catch (error) {
    next(error);
  }
};

module.exports.setAvatar = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const image = req.body.image;
    const userData = await User.findByIdAndUpdate(
      userId,
      {
        isAvatarImageSet: true,
        avatarImage: image,
      },
      { new: true }
    );
    await userData.save();
    return res.json({
      isSet: userData.isAvatarImageSet,
      image: userData.avatarImage,
    });
  } catch (error) {
    next(error);
  }
};

module.exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({ _id: { $ne: req.params.id } }).select([
      "username",
      "email",
      "avatarImage",
      "_id",
    ]);
    return res.json({ users });
  } catch (error) {
    next(error);
  }
};

module.exports.logout = async (req, res, next) => {
  try {
    if (!req.params.id) {
      res.json({ message: "User id is required" });
    }
    User.delete(req.params.id);
    return res.status(200).send();
  } catch (error) {
    next(error);
  }
};
