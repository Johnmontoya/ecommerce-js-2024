async function LogUser(req, res, next) {
    try {
        const user = req.token;
        if(!user){
            return res.status(403).json({ message: 'El usuario no ha iniciado sesión'})
        }
        return next()
    } catch (error) {
        next(error)
    }
}

module.exports = LogUser