const { decode } = require('../utils/jwt')

const auth = async (req, res) => {
    //Check for Authorization header
    const authHeader = req.header('Authorization') ? req.header('Authorization').split(' ') : null
    if (!authHeader) {
        return res.status(422).json({
            errors: { body: ['Authorization failed', 'No Authorization header'] }
        })
    }
    //Check if authorization type is token
    if (authHeader[0] !== 'Token')
        return res.status(401).json({
            errors: { body: ['Authorization failed', 'Token missing'] }
        })
    //Check if token is valid
    const token = authHeader[1];
    const decodedToken = await decode(token)
    return decodedToken
}

module.exports.authByToken = async (req, res, next) => {
    try {
        const user = await auth(req, res)
        if (!user) {
            throw new Error('No user found in token')
        }
        req.user = user
        return next()
    } catch (e) {
        return res.status(401).json({
            errors: { body: ['Authorization failed', e.message] }
        })
    }
}

module.exports.authAdminByToken = async (req, res, next) => {
    try {
        const user = await auth(req, res)
        if (!user) {
            throw new Error('No user found in token')
        }
        req.user = user
        if (user.roleName != 'admin') {
            throw new Error('Not allowed to access it')
        }
        return next()
    } catch (e) {
        return res.status(401).json({
            errors: { body: ['Authorization failed', e.message] }
        })
    }
}
