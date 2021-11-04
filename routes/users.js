const express = require('express')
const router = express.Router()
const UserController = require('../controllers/users')
const { authByToken } = require('../middleware/auth')

router.post('/users', UserController.createUser)
router.post('/users/login', UserController.loginUser)
// router.get('/user')
router.patch('/user', authByToken, UserController.updateUserDetails)

module.exports = router