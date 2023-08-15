function errHandler(err, req, res, next) {
  //Handling user Error
    if(err === 'UnauthorizedError') {
      return res.status(401).json({message: 'User not authorized'})
    }
   // Handling upload Error
    if(err === 'Invalidation') {
      return res.status(401).json({message: 'Invalid file upload'})
    }

}

module.exports = errHandler;