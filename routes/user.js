const express = require('express');

const userController = require('../controller/userController');
const isAuthMiddleware = require('../middleware/isAuth');
const router=express.Router();

router.get('/profile',isAuthMiddleware.isAuth,userController.getProfile);

router.get('/project-submit',isAuthMiddleware.isAuth,userController.getProjectSubmit);
router.post('/project-submit',isAuthMiddleware.isAuth,userController.postProjectSubmit);


router.get('/project-list',isAuthMiddleware.isAuth,userController.getProjectList);

router.post('/delete-project',isAuthMiddleware.isAuth,userController.postDeleteProject);

router.post('/logout',isAuthMiddleware.isAuth,userController.postLogout);

module.exports=router;