const express = require('express');
const router = express.Router();
const accountController = require('../controllers/account');
const auth = require('../config/authenticate/auth');
const middleware = require('../config/authenticate/middleware');

//dashboard page
router.get('/dashboard', auth.authenticate, auth.investYiel, auth.bonus, accountController.dashboard);

//invest route
router.get('/investment', auth.authenticate, accountController.investment);

//Not part of this route
router.get('/new-trade', auth.authenticate, accountController.trade);

//Not part of this route
router.post('/new-trade', auth.authenticate, accountController.newTrade);

//widthrawal route
router.post('/withdraw', auth.authenticate, accountController.withdraw);

//referral withdrawal route
router.post('/referral', auth.authenticate, accountController.referral);

//Profile
router.get('/profile', auth.authenticate, accountController.profile);

//update profile
router.patch('/profile', auth.authenticate, accountController.updateProfile);

//Bank details
router.get('/bank', auth.authenticate, accountController.bank);

//create bank details
router.post('/bank', auth.authenticate, accountController.createBank);

//get update bank route
router.get('/update-bank', auth.authenticate, accountController.updateBank);

//update bank details
router.patch('/update-bank', auth.authenticate, accountController.updatedBank);

//referral page
router.get('/referrals', auth.authenticate, accountController.referrals);

//logout route
router.get('/logout', auth.authenticate, accountController.logout);

module.exports = router;