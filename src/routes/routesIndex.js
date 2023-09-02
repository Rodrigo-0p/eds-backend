
const express                   = require('express');
const router                    = express.Router();
// PUBLIC
const Pblogin                   = require('./pb/routerPublic');

// BASE
const bsperson                   = require('./bs/definicion/BSPERSON');

module.exports = function(){

    // PB
    router.use( Pblogin()       );
    // BASE
    router.use( bsperson()      );


    
    return router;
}