const express = require('express');
const router  = express.Router();
const auth    = require('../../controller/public/login');

module.exports = function(){
    router.get('/api/auth/login'  , auth.AutenticarUsuario);
    return router;
}