const {
  register,
  login,
  setAvatar,
  getAllUsers,
  logout,
} = require("../controllers/userController");

const router = require("express").Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout/:id", logout);
router.post("/setAvatar/:userId", setAvatar);
router.get("/getAllUsers/:id", getAllUsers);

module.exports = router;
