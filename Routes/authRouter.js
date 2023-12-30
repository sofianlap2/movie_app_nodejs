const express = require("express");

const router = express.Router();

const authController = require('../Controllers/authController')

router.route('/signup').post(authController.signup);

module.exports = router;