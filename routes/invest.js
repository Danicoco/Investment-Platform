const express = require('express');
const router = express.Router();
const investController = require('../controllers/invest');
const auth = require('../config/authenticate/auth');
const {storage} = require('../cloudinary');
const multer  = require('multer');
const upload = multer({ storage });
const validator = require('../config/validators/valid');

//Place Investment route
router.get('/penny/:id', auth.authenticate, investController.placeInvest);

//accept investment route
router.post('/penny/:id', auth.authenticate, upload.single('pop'), investController.acceptInvest);

//investment history
router.get('/investment-history', auth.authenticate, investController.history);

//withdraw route
router.get('/withdraw-history', auth.authenticate, investController.withdraw);

module.exports = router;