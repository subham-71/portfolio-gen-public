const express = require('express');
const {handleMail,sendOtpMail,verifyOtpMail} = require('../controllers/emailController.js');
const router = express.Router();

router.post('/sendmail', handleMail);
router.post('/sendotp', sendOtpMail);
router.post('/verifyotp', verifyOtpMail);


module.exports = {
    routes: router
}