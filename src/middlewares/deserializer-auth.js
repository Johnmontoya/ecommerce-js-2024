const jwt = require("jsonwebtoken");

const verify = (token) => {
    try {
        const decoded = jwt.verify(token, 'mysecret')
        return {
            valid: true,
            expired: false,
            decoded
        }
    } catch (error) {
        throw (error)
    }
}

async function Authenticate(req, res, next){
    try {
        const bearerToken = req.headers.authorization;
        let token = bearerToken;
        
        if(bearerToken && bearerToken.startsWith("Bearer ")){
            token = bearerToken.substring(7)
        }

        if(!token) return next()

        const { decoded, expired, valid } = verify(token)

        if(valid && !expired){
            req.token = decoded
            return next()
        } else {
            return res.status(403).json({
                error: true
            })
        }

    } catch (error) {
        next(error)
    }
}

module.exports = Authenticate;