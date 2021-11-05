const express = require('express')
const router = express.Router()

const UserController = require('../controllers/users')
const { authByToken, authAdminByToken } = require('../middleware/auth')

router.get('/user', authByToken, UserController.getUserInformation)
router.post('/user/login', UserController.loginUser)
router.get('/users', authAdminByToken, UserController.getAllUsers)
router.post('/users', UserController.createUser)
router.get('/users/:username', authAdminByToken, UserController.getUserByUsername)
router.put('/users/:username', authAdminByToken, UserController.updateUserDetails)
router.delete('/users/:username', authAdminByToken, UserController.deleteUserByUsername)

module.exports = router