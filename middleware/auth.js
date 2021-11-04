const { decode } = require('../utils/jwt')

module.exports.authByToken = async (req, res, next) => {
    try {
        const authHeader = req.header('Authorization') ? req.header('Authorization').split(' ') : null
        if (!authHeader) {
            return res.status(422).json({
                error: ['Authorization failed', 'No Authorization header']
            })
        }
        //Check if authorization type is token
        if (authHeader[0] !== 'Token') {
            return res.status(401).json({
                error: ['Authorization failed', 'Token missing']
            })
        }
        //Check if token is valid
        const token = authHeader[1]
        const user = await decode(token)
        if (!user) {
            throw new Error('No user found in token')
        }
        req.user = user
        return next()
    } catch (e) {
        const status = res.statusCode ? res.statusCode : 401
        return res.status(status).json({
            error: ['Authorization failed', e.message]
        })
    }
}

module.exports.authAdminByToken = async (req, res, next) => {
    try {
        const authHeader = req.header('Authorization') ? req.header('Authorization').split(' ') : null
        if (!authHeader) {
            return res.status(422).json({
                error: ['Authorization failed', 'No Authorization header']
            })
        }
        //Check if authorization type is token
        if (authHeader[0] !== 'Token') {
            return res.status(401).json({
                error: ['Authorization failed', 'Token missing']
            })
        }
        //Check if token is valid
        const token = authHeader[1]
        const user = await decode(token)
        if (!user) {
            throw new Error('No user found in token')
        }
        req.user = user
        if (user.roleName != 'admin') {
            throw new Error('Not allowed to access it')
        }
        return next()
    } catch (e) {
        const status = res.statusCode ? res.statusCode : 401
        return res.status(status).json({
            error: ['Authorization failed', e.message]
        })
    }
}
