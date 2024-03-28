
const express                   = require('express');
const router                    = express.Router();
// PUBLIC
const Pblogin                   = require('./pb/routerPublic');
const infoEmpresa               = require('./pb/infoEmpresa/infoEmpresa'    );
const infoSucursal              = require('./pb/infoSucursal/infoSucursal'  );

// BASE
const bsperson                  = require('./bs/definicion/BSPERSON'        );

// COMPRAS DEF
const cmprovec                  = require('./cm/definicion/CMPROVEC'        );
// COMPRAS MOV
const cmfactur                  = require('./cm/movimiento/CMFACTUR'        );
const cmcoffac                  = require('./cm/movimiento/CMCOFFAC'        );

// VENTAS   
const vtclient                  = require('./vt/definicion/VTCLIENT'        );
const vtvende                   = require('./vt/definicion/VTVENDE'         );
const vtlispre                  = require('./vt/definicion/VTLISPRE'        );

// STOCK DEFINICION
const starticu                  = require('./st/definicion/STARTICU'        );
// STOCK MOVIMIENTO
const stentsal                  = require('./st/movimiento/STENTSAL'        );
const stenvio                   = require('./st/movimiento/STENVIO'         );

module.exports = function(){

    // PB
    router.use( Pblogin()       );
    router.use( infoEmpresa()   );
    router.use( infoSucursal()  );
    
    // BASE
    router.use( bsperson()      );

    //  COMPRAS DEFINICION
    router.use( cmprovec()      );
    //  COMPRAS MOVIMIENTO
    router.use( cmfactur()      );
    router.use( cmcoffac()      );

    // VENTAS
    router.use( vtclient()      );
    router.use( vtvende()       );
    router.use( vtlispre()      );
    
    //STOCK DEFINICION
    router.use( starticu()      );
    // MOVIMIENTO
    router.use( stentsal()      );
    router.use( stenvio()       );


    
    return router;
}