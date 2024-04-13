
async function isAdmin(req, res, next) {
  try {
    const user = req.token
    if(user.role !== 'Admin') {      
        return res.status(403).json({
          message: 'No tiene permisos para realizar esa acccion'
        })
    }
    return next()
  } catch (error) {
    next(error)
  }
}

module.exports = isAdmin