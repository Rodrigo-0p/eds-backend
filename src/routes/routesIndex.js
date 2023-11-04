
const express                   = require('express');
const router                    = express.Router();
// PUBLIC
const Pblogin                   = require('./pb/routerPublic');
const infoEmpresa               = require('./pb/infoEmpresa/infoEmpresa');

// BASE
const bsperson                  = require('./bs/definicion/BSPERSON');

// COMPRAS 
const cmprovec                  = require('./cm/definicion/CMPROVEC');


module.exports = function(){

    // PB
    router.use( Pblogin()       );
    router.use( infoEmpresa()   );   
    
    // BASE
    router.use( bsperson()      );


    // IMPORTACIONES Y COMPRAS
    router.use(cmprovec()       );


    
    return router;
}