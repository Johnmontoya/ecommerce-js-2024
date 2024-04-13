function errorHandler(err, req, res, next) {

    if(err.name === 'TokenExpiredError') {
        return res.status(401).json({error: "Token has expired"})
    }
    
    if (err.name === 'UnauthorizedError') {
        // * jwt authentication error
        return res.status(401).json({error: "The user is not authorized"})
    }

    if (err.name === 'ValidationError') {
        // * validation error de joi
        return res.status(401).json({error: err})
    }

    // default to 500 server error
    console.log(err)
    return res.status(500).json(err);
}

module.exports = errorHandler;