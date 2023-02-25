const express = require('express');
const {createUser, getUsers, deleteUser, editUser} = require('../controllers/user.controller')
const userRouter = express.Router();


userRouter.route('/user')
    .post(createUser)
    .get(getUsers)

userRouter.route('/user/:id')
    .delete(deleteUser)
    .put(editUser)


module.exports = userRouter;