const { databaseVersion } = require('../dbCon')
const User = require('../models/User')
const { hashPassword, matchPassword } = require('../utils/password')
const { sign, decode } = require('../utils/jwt')

module.exports.createUser = async (req, res) => {
    try {
        if (!req.body.user.username) throw new Error("username is required")
        if (!req.body.user.password) throw new Error("password is required")

        const existingUser = await User.findByPk(req.body.user.username)
        if (existingUser)
            throw new Error('user aldready exists with this username id')

        const password = await hashPassword(req.body.user.password);
        const user = await User.create({
            username: req.body.user.username,
            password: password,
            commentary: req.body.user.commentary,
        })

        if (user) {
            if (user.dataValues.password)
                delete user.dataValues.password
            user.dataValues.token = await sign(user)
            res.status(201).json({ user })
        }
    } catch (e) {
        res.status(422).json({ errors: { body: ['Could not create user ', e.message] } })
    }
}

module.exports.loginUser = async (req, res) => {
    try {
        if (!req.body.user.username) throw new Error('Username is Required')
        if (!req.body.user.password) throw new Error('Password is Required')

        const user = await User.findByPk(req.body.user.username)

        if (!user) {
            res.status(401)
            throw new Error('No User with this username')
        }

        //Check if password matches
        const passwordMatch = await matchPassword(user.password, req.body.user.password)

        if (!passwordMatch) {
            res.status(401)
            throw new Error('Invalid password or username')
        }

        delete user.dataValues.password
        user.dataValues.token = await sign({ email: user.dataValues.email, username: user.dataValues.username })

        res.status(200).json({ user })
    } catch (e) {
        const status = res.statusCode ? res.statusCode : 500
        res.status(status).json({ errors: { body: ['Could not create user ', e.message] } })
    }
}

module.exports.getUserByUsername = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.username)
        if (!user) {
            throw new Error('No such user found')
        }
        delete user.dataValues.password
        user.dataValues.token = req.header('Authorization').split(' ')[1]
        return res.status(200).json({ user })
    } catch (e) {
        return res.status(404).json({
            errors: { body: [e.message] }
        })
    }
}

module.exports.updateUserDetails = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.username)

        if (!user) {
            res.status(401)
            throw new Error('No user with this username')
        }

        if (req.body.user) {
            const username = req.body.user.username ? req.body.user.username : user.username
            const commentary = req.body.user.commentary ? req.body.user.commentary : user.commentary
            let password = user.password
            if (req.body.user.password)
                password = await hashPassword(req.body.user.password)

            const updatedUser = await user.update({ username, password, commentary })
            delete updatedUser.dataValues.password
            updatedUser.dataValues.token = req.header('Authorization').split(' ')[1]
            res.json(updatedUser)
        } else {
            delete user.dataValues.password
            user.dataValues.token = req.header('Authorization').split(' ')[1]
            res.json(user)
        }

    } catch (e) {
        const status = res.statusCode ? res.statusCode : 500
        return res.status(status).json({
            errors: { body: [e.message] }
        })
    }
}

module.exports.deleteUserByUsername = async (req, res) => {
    try {
        const deleter = await User.findByPk(req)
        const user = await User.findByPk(username)

        if (!user) {
            res.status(404)
            throw new Error('user not found')
        }
    } catch (e) {
        const code = res.statusCode ? res.statusCode : 422;
        return res.status(code).json({
            errors: { body: ['Could not delete article', e.message] },
        });
    }
}