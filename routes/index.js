const express = require('express');
const router = express.Router();
const userController = require('../controllers/users');
const validator = require('../config/validators/valid');

//home route
router.get('/', userController.home);

//login page route
router.get('/login', userController.loginShow);

//login route @POST
router.post('/login', userController.postLogin);

//register page route
router.get('/register', userController.registerShow);

//register route @POST
router.post('/register', validator.regText, userController.postReg);

//register page route
router.get('/register/:ref', userController.refShow);

//register route @POST
router.post('/register/:ref', validator.regText, userController.refPost);


module.exports = router;