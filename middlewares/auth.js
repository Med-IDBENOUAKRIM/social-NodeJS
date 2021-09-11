const jwt = require('jsonwebtoken');

exports.isSignIn = async (req, res, next) => {
    try {
        
        const token = req.headers.authorization;
        const user  = jwt.verify(token, process.env.JWT_SECRET);
        
        if(!token) {
            return res.status(400).json({error: 'You don\'t have permission !!!'});
        }
        
        
        req.profile = user;
        next();
    } catch (error) {
        return res.status(500).json({error: 'You are not login!!!'})
    }
}