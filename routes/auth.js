const express = require('express');

const authController = require('../controller/authController');

const router=express.Router();

router.get('/login',authController.getLogin);
router.post('/login',authController.postLogin);

router.get('/sign-up',authController.getSignup);
router.post('/sign-up',authController.postSignup);
module.exports=router;