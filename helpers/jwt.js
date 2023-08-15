const {expressjwt:expressjwt} = require('express-jwt')

function authJwt() {
    const secret = process.env.secret;
    return expressjwt({
        secret,
        algorithms: ['HS256'],
        isRevoked: isRevoked
    }).unless({
        path: [ 
            {url: /\/v1\/public\/uploads(.*)/, methods: ['GET', 'OPTIONS']},
            {url: /\/v1\/products(.*)/, methods: ['GET', 'OPTIONS']},
            {url: /\/v1\/categories(.*)/, methods: ['GET', 'OPTIONS']},
            '/v1/user/login',
            '/v1/user/register'
        ]
    })
}

async function isRevoked(req, token){
    if(!token.payload.isAdmin) {
       return true;
    }
}

module.exports = {
    authJwt,
}
