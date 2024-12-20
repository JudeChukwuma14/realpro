const User = require("../models/usermodel");
const bcrptjs = require("bcryptjs");
const errorHandler = require("../utils/error");
const jwt = require("jsonwebtoken");

const postUser = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const hashedpassword = bcrptjs.hashSync(password, 10);
    const newUser = new User({ username, email, password: hashedpassword });
    await newUser.save();
    res.status(200).json("User created successfully!!");
  } catch (error) {
    next(error);
  }
};

const signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const valiUser = await User.findOne({ email });
    if (!valiUser) {
      return next(errorHandler(404, "User not found!"));
    }
    const validPassword = bcrptjs.compareSync(password, valiUser.password);
    if (!validPassword) {
      return next(errorHandler(400, "Wrong Credentials!!"));
    }

    const token = jwt.sign({ id: valiUser._id }, process.env.JWT_SECERT);
    const { password: pass, ...rest } = valiUser._doc;
    res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json(rest);
  } catch (error) {
    next(error);
  }
};

const google = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECERT);
      const { password: pass, ...rest } = user._doc;
      res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(rest);
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = bcrptjs.hashSync(generatedPassword, 10);
      const newUser = new User({
        username:
          req.body.name.split(" ").join("").toLowerCase() +
          Math.random().toString(36).slice(-8) +
          Math.random().toString(36).slice(-8),
        email: req.body.email,
        password: hashedPassword,
        avatar: req.body.photo,
      });
      await newUser.save();
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECERT);
      const { password: pass, ...rest } = newUser._doc;
      res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, "You can only update your own account"));

  try {
    if (req.body.password) {
      req.body.password = bcrptjs.hashSync(req.body.password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          avatar: req.body.avatar,
        },
      },
      { new: true }
    );

    const { password, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (err) {
    next(err.message);
  }
};

const deleteUser = async (req, res,next) => {
  if(req.user.id !== req.params.id){
    return next(errorHandler(403,"You can only detele your own account"))
  }
  try {
    await User.findByIdAndDelete(req.params.id)
    res.clearCookie("access_token");
    res.status(200).json({message:"Account deleted successfully"})
  } catch (error) {
   next(error) 
  }
}

const signout = async (req, res, next) => {
  try {
    res.clearCookie("access_token");
    res.status(200).json("User has been logged out")
    
  } catch (error) {
    next(error)
  }
}
module.exports = { postUser, signIn, google, updateUser, deleteUser,signout };
