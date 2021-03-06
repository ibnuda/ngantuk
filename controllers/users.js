const { databaseVersion } = require('../dbCon')
const User = require('../models/User')
const { hashPassword, matchPassword } = require('../utils/password')
const { sign, decode } = require('../utils/jwt')

module.exports.createUser = async (req, res) => {
    try {
        if (!req.body.username) throw new Error("username is required")
        if (!req.body.password) throw new Error("password is required")

        const existingUser = await User.findByPk(req.body.username)
        if (existingUser) {
            throw new Error('user aldready exists with this username id')
        }

        const password = await hashPassword(req.body.password);
        const user = await User.create({
            username: req.body.username,
            password: password,
            commentary: req.body.commentary,
            roleName: null
        })

        if (user) {
            if (user.dataValues.password) {
                delete user.dataValues.password
            }
            user.dataValues.token = await sign(user)
            res.status(201).json({ user })
        }
    } catch (e) {
        const status = res.statusCode ? res.statusCode : 500
        res.status(status).json({ error: ['Could not create user ', e.message] })
    }
}

module.exports.loginUser = async (req, res) => {
    try {
        if (!req.body.username) throw new Error('Username is Required')
        if (!req.body.password) throw new Error('Password is Required')

        const user = await User.findByPk(req.body.username)

        if (!user) {
            res.status(404)
            throw new Error('No User with this username')
        }

        //Check if password matches
        const passwordMatch = await matchPassword(user.password, req.body.password)

        if (!passwordMatch) {
            res.status(401)
            throw new Error('Invalid password or username')
        }

        delete user.dataValues.password
        token = await sign({
            username: user.dataValues.username,
            commentary: user.dataValues.commentary,
            roleName: user.dataValues.roleName
        })

        res.status(200).json({
            username: user.dataValues.username,
            commentary: user.dataValues.commentary,
            roleName: user.dataValues.roleName,
            token: token
        })
    } catch (e) {
        const status = res.statusCode ? res.statusCode : 500
        res.status(status).json({ error: ['Cannot check user', e.message] })
    }
}

module.exports.getUserInformation = async (req, res) => {
    try {
        const username = req.user.username
        const user = await User.findByPk(username)
        delete user.dataValues.password
        res.status(200).json({
            username: user.dataValues.username,
            commentary: user.dataValues.commentary,
            roleName: user.dataValues.roleName
        })
    } catch (error) {
        const status = res.statusCode ? res.statusCode : 500
        res.status(status).json({ errors: ['cannot check user', error.message] })
    }
}

const properUsersData = (getUsers) => {
    let users = []
    for (const getUser of getUsers) {
        const username = getUser.dataValues.username
        const commentary = getUser.dataValues.commentary
        const roleName = getUser.dataValues.roleName
        users.push({
            username: username,
            commentary: commentary,
            roleName: roleName
        })
    }
    return users
}

module.exports.getAllUsers = async (req, res) => {
    try {
        const getUsers = await User.findAll();
        const users = properUsersData(getUsers)
        res.status(200).json({ users })
    } catch (e) {
        const code = res.statusCode ? res.statusCode : 422;
        res.status(code).json({ error: [e.message] })
    }
}

module.exports.getUserByUsername = async (req, res) => {
    try {
        const { username } = req.params;
        const user = await User.findByPk(username)
        if (!user) {
            throw new Error('No such user found')
        }
        delete user.dataValues.password
        user.dataValues.token = req.header('Authorization').split(' ')[1]
        return res.status(200).json({ user })
    } catch (e) {
        const code = res.statusCode ? res.statusCode : 422;
        return res.status(code).json({ error: [e.message] })
    }
}

module.exports.updateUserDetails = async (req, res) => {
    try {
        const { username } = req.params;
        const user = await User.findByPk(username)
        if (!user) {
            res.status(401)
            throw new Error('No user with this username')
        }

        if (req.body) {
            const commentary = req.body.commentary ? req.body.commentary : user.dataValues.commentary
            const roleName = req.body.roleName ? req.body.roleName : user.dataValues.roleName
            if (req.body.password) {
                hashedPass = await hashPassword(req.body.user.password)
            }
            const password = req.body.password ? hashedPass : user.dataValues.password

            const updatedUser = await user.update({
                commentary: commentary,
                password: password,
                roleName: roleName,
            })
            delete updatedUser.dataValues.password
            res.json(updatedUser)
        } else {
            delete user.dataValues.password
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
        const { username } = req.params
        const user = await User.findByPk(username)

        if (!user) {
            res.status(404);
            throw new Error('user not found');
        }

        await User.destroy({ where: { username: username } })
        res.status(200).json({ message: 'user deleted successfully' });
    } catch (e) {
        const code = res.statusCode ? res.statusCode : 422;
        return res.status(code).json({
            errors: { body: ['could not delete user', e.message] },
        });
    }
}