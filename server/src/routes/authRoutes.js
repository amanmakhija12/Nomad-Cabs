const express = require("express");
const router = express.Router();
const {
  signup,
  login,
  me,
  requireRole,
} = require("../controllers/authController");

router.post("/signup", signup);
router.post("/login", login);
router.get("/me", me);
router.get("/role/:role", requireRole);

module.exports = router;
