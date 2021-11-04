const express = require('express')
const router = express.Router()
const UserController = require('../controllers/users')
const { authByToken, authAdminByToken } = require('../middleware/auth')

router.get('/user', authByToken)
router.get('/users', authAdminByToken, UserController.getAllUsers)
router.get('/users/:username', authAdminByToken, UserController.getUserByUsername)
router.post('/users', UserController.createUser)
router.post('/users/login', UserController.loginUser)
router.put('/users/:username', authAdminByToken, UserController.updateUserDetails)
router.delete('/users/:username', authAdminByToken, UserController.deleteUserByUsername)

module.exports = router