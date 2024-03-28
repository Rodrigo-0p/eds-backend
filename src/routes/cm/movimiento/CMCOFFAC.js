const express = require('express');
const router  = express.Router();

// list
const lCabecera  = require('../../../controller/modules/cm/movimiento/CMCOFFAC/listar/listCab');
// valida
const vfacturado = require('../../../controller/modules/cm/movimiento/CMCOFFAC/validador/validaFacturado');
// reporte
const rcmcoffac  = require('../../../controller/modules/cm/movimiento/CMCOFFAC/reporte/RSTENTSAL');
// update
const cmcoffac   = require('../../../controller/modules/cm/movimiento/CMCOFFAC/main');

module.exports = function(){

  // list
  router.post('/cm/cmcoffac/list/cabecera'     , lCabecera.main  );
  // valida
  router.post('/cm/cmcoffac/valida/facturado'  , vfacturado.main );
  // reporte
  router.post('/cm/cmcoffac/reporte/rcmcoffac' , rcmcoffac.main  );
  // updata
  router.post('/cm/cmcoffac'                   , cmcoffac.main   );
  
  return router;
}