const { decode } = require('../utils/jwt')

module.exports.authByToken = async (req, res, next) => {
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
    try {
        const user = await decode(token)
        console.log(user)
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