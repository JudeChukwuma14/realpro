const express = require("express");
const {
  postUser,
  signIn,
  google,
  updateUser,
  deleteUser,
  signout,
} = require("../controller/userController");
const { verifyToken } = require("../utils/veriftyUser");
const router = express.Router();

router.post("/postuser", postUser);
router.post("/signin", signIn);
router.post("/google", google);
router.post("/update/:id", verifyToken, updateUser);
router.delete("/delete/:id", verifyToken, deleteUser);
router.get("/signout",signout)

module.exports = router;
