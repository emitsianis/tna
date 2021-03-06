const express = require("express");
const router = express.Router();

const AuthController = require("../controllers/auth.controller");
const auth = require("../middleware/auth");

router.get("/", auth, AuthController.getUser);

router.post("/register", AuthController.register);

router.post("/login", AuthController.login);

module.exports = router;
