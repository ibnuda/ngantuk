module.exports.notFound = (req, res, next) => {
    const err = new Error(`not found.`)
    res.status(404)
    next(err)
}

module.exports.errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode
    res.status(statusCode)
    const info = {
        message: err.message,
    }
    res.json(info)
}

