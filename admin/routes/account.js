const express = require('express');
const router = express.Router();
const accountController = require('../controllers/account');
const auth = require('../config/authenticate/auth');

//all users
router.get('/dashboard', auth.authenticate, accountController.dashboard);

//all investments
router.get('/all-investment', auth.authenticate, accountController.allInvestment);

//confirm investment
router.patch('/confirm-invest', auth.authenticate, accountController.confirmInvest);

//decline investment
router.patch('/decline-invest', auth.authenticate, accountController.declineInvest);

//delete investment
router.delete('/delete-invest', auth.authenticate, accountController.deleteInvest);

//Referral withdrawal
router.get('/referral-withdrawal', auth.authenticate, accountController.referralWithdrawal);

//confirm withdrawal
router.patch('/confirm-referral', auth.authenticate, accountController.confirmReferral);

//decline withdrawal
router.patch('/decline-referral', auth.authenticate, accountController.declineReferral);

//withdrawals
router.get('/all-withdrawals', auth.authenticate, accountController.allWithdrawal);

//confirm withdrawal
router.patch('/confirm-withdraw', auth.authenticate, accountController.confirmWithdraw);

//decline withdrawal
router.patch('/decline-withdraw', auth.authenticate, accountController.declineWithdraw);

//trade route
router.get('/trade', auth.authenticate, accountController.showTrade);

//create trades
router.get('/new-trade', auth.authenticate, accountController.newTrade);

//post create trades
router.post('/new-trade', auth.authenticate, accountController.postNewTrade);

//activate trades
router.patch('/activate-trade', auth.authenticate, accountController.activateTrade);

//pause trades
router.patch('/pause-trade', auth.authenticate, accountController.pauseTrade);

//delete trades
router.delete('/delete-trade', auth.authenticate, accountController.deleteTrade);

module.exports = router;