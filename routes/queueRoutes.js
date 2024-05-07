const express = require("express");
const { protect } = require("../middleware/auth");
const {
  getQueues,
  createQueue,
  getQueue,
  getTodayQueue,
  getTodayUnattended,
  attendPatient,
} = require("../controllers/queueController");

const router = express.Router();
router.use(protect);

router.route("/").get(getQueues).post(createQueue);
router.route("/today").get(getTodayQueue);
router.route("/today/unattended").get(getTodayUnattended);
router.route("/:id").get(getQueue);
router.route("/attend").put(attendPatient);

module.exports = router;
