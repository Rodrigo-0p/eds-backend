
const express                   = require('express');
const router                    = express.Router();
// PUBLIC
const Pblogin                   = require('./pb/routerPublic');
const infoEmpresa               = require('./pb/infoEmpresa/infoEmpresa'    );
const infoSucursal              = require('./pb/infoSucursal/infoSucursal'  );

// BASE
const bsperson                  = require('./bs/definicion/BSPERSON'        );

// COMPRAS 
const cmprovec                  = require('./cm/definicion/CMPROVEC'        );

// VENTAS   
const vtclient                  = require('./vt/definicion/VTCLIENT'        );
const vtvende                   = require('./vt/definicion/VTVENDE'         );
const vtlispre                  = require('./vt/definicion/VTLISPRE'        );

// STOCK
const starticu                  = require('./st/definicion/STARTICU'        );

module.exports = function(){

    // PB
    router.use( Pblogin()       );
    router.use( infoEmpresa()   );
    router.use( infoSucursal()  );
    
    // BASE
    router.use( bsperson()      );

    // IMPORTACIONES Y COMPRAS
    router.use( cmprovec()      );

    // VENTAS
    router.use( vtclient()      );
    router.use( vtvende()       );
    router.use( vtlispre()      );
    
    //STOCK
    router.use( starticu()      );


    
    return router;
}