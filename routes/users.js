const express = require('express')
const router = express.Router()
const UserController = require('../controllers/users')
const { authByToken } = require('../middleware/auth')

router.get('/users', authByToken, UserController.getAllUsers)
router.post('/users', UserController.createUser)
router.post('/users/login', UserController.loginUser)
router.patch('/user', authByToken, UserController.updateUserDetails)

module.exports = router