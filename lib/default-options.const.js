module.exports = {
    allowedOrigin: '*',
    allowedMethods: ['POST', 'GET', 'HEAD', 'OPTIONS', 'PUT', 'DELETE', 'CONNECT', 'TRACE', 'PATCH'],
    allowedHeaders: [
        'content-type', 
        'authorization', 
        'x-access-token', 
        'x-auth-token', 
        'accept', 
        'accept-language', 
        'content-language'
    ],
    maxAge: 3600,
    allowCredentials: false
};
