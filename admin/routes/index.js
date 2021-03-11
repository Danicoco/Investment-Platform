const express = require('express');
const router = express.Router();
const userController = require('../controllers/users');
const validator = require('../config/validators/valid');
const auth = require('../config/authenticate/auth');

//home route
router.get('/', userController.home);

//login page route
router.get('/login', userController.loginShow);

//login route @POST
router.post('/login', userController.postLogin);

//register page route
router.get('/add-admin', auth.authenticate, userController.registerShow);

//register route @POST
router.post('/add-admin', auth.authenticate, validator.regText, userController.postReg);

//logout route
router.get('/logout', userController.logout);

module.exports = router;