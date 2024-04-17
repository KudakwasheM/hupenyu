const express = require("express");
const { protect, authorize } = require("../middleware/auth");
const {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  softDeleteUser,
  restoreUser,
} = require("../controllers/usersController");

const User = require("../models/userModel");
const advancedResults = require("../middleware/advancedResults");

const router = express.Router();

router.use(protect);
router.use(authorize("super", "admin", "doctor"));

router
  .route("/")
  .get(
    // advancedResults(User),
    getUsers
  )
  .post(createUser);
router.route("/:id").get(getUser).put(updateUser);
router.route("/delete/:id").put(softDeleteUser);
router.route("/restore/:id").put(restoreUser);

module.exports = router;
