const express = require('express');
const router  = express.Router();

// BUSCADORES
const bsucursal  = require('../../../controller/modules/st/movimiento/STENTSAL/buscador/getSucursal'     );
const bmotivo    = require('../../../controller/modules/st/movimiento/STENTSAL/buscador/getMotivo'       );
const bdeposito  = require('../../../controller/modules/st/movimiento/STENTSAL/buscador/getDeposito'     );
const bproveedor = require('../../../controller/modules/st/movimiento/STENTSAL/buscador/getProveedor'    );
const bmoneda    = require('../../../controller/modules/st/movimiento/STENTSAL/buscador/getMoneda'       );
const barticulo  = require('../../../controller/modules/st/movimiento/STENTSAL/buscador/getArticulo'     );
const bum        = require('../../../controller/modules/st/movimiento/STENTSAL/buscador/getUm'           );
// VALIDADORES
const vsucursal  = require('../../../controller/modules/st/movimiento/STENTSAL/validador/validaSucursal' );
const vmotivo    = require('../../../controller/modules/st/movimiento/STENTSAL/validador/validaMotivo'   );
const vdeposito  = require('../../../controller/modules/st/movimiento/STENTSAL/validador/validaDeposito' );
const vproveedor = require('../../../controller/modules/st/movimiento/STENTSAL/validador/validaProveedor');
const vmoneda    = require('../../../controller/modules/st/movimiento/STENTSAL/validador/validaMoneda'   );
const varticulo  = require('../../../controller/modules/st/movimiento/STENTSAL/validador/validaArticulo' );
const vum        = require('../../../controller/modules/st/movimiento/STENTSAL/validador/validaUm'       );
const vcantidad  = require('../../../controller/modules/st/movimiento/STENTSAL/validador/validaCantidad' );
// LIST      
const lcabecera  = require('../../../controller/modules/st/movimiento/STENTSAL/listar/listCab'           );
const ldetalle   = require('../../../controller/modules/st/movimiento/STENTSAL/listar/listDet'           );
const lpostquery = require('../../../controller/modules/st/movimiento/STENTSAL/listar/postQuery'         );
// ABM
const main       = require('../../../controller/modules/st/movimiento/STENTSAL/main'                     );
// REPORTE
const rstentsal  = require('../../../controller/modules/st/movimiento/STENTSAL/reporte/RSTENTSAL'        );

module.exports = function(){
  // ABMu
  router.get('/st/stentsal/buscar/:cod_empresa'                        , main.getNroEntSal );
  router.get('/st/stentsal/buscar/orden/:cod_empresa/:cod_nro_ent_sal' , main.getNrOrden   );
  router.post('/st/stentsal'                  , main.main        );
  // LIST
  router.post('/st/stentsal/list/cabecera'    , lcabecera.main   );
  router.post('/st/stentsal/list/detalle'     , ldetalle.main    );
  router.post('/st/stentsal/list/postqueryCab', lpostquery.main  );
  // BUSCADORES  
  router.post('/st/stentsal/buscar/sucursal'  , bsucursal.main   );
  router.post('/st/stentsal/buscar/motivo'    , bmotivo.main     );
  router.post('/st/stentsal/buscar/deposito'  , bdeposito.main   );
  router.post('/st/stentsal/buscar/proveedor' , bproveedor.main  );
  router.post('/st/stentsal/buscar/moneda'    , bmoneda.main     );
  router.post('/st/stentsal/buscar/articulo'  , barticulo.main   );
  router.post('/st/stentsal/buscar/um'        , bum.main         );
  // VALIDADORES
  router.post('/st/stentsal/valida/sucursal'  , vsucursal.main   );
  router.post('/st/stentsal/valida/motivo'    , vmotivo.main     );
  router.post('/st/stentsal/valida/deposito'  , vdeposito.main   );
  router.post('/st/stentsal/valida/proveedor' , vproveedor.main  );
  router.post('/st/stentsal/valida/moneda'    , vmoneda.main     );
  router.post('/st/stentsal/valida/articulo'  , varticulo.main   );
  router.post('/st/stentsal/valida/um'        , vum.main         );
  router.post('/st/stentsal/valida/cantidad'  , vcantidad.main   );
  // REPORTE
  router.post('/st/stentsal/reporte/rstentsal', rstentsal.main   );  
  return router;
}