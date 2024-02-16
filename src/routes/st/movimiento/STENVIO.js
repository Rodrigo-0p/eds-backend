const express = require('express');
const router  = express.Router();

// BUSCADORES
const bsucursal      = require('../../../controller/modules/st/movimiento/STENVIO/buscador/getSucursal'        );
const btipCambio     = require('../../../controller/modules/st/movimiento/STENVIO/buscador/getTipCambio'       );
const bmotivo        = require('../../../controller/modules/st/movimiento/STENVIO/buscador/getMotivo'          );
const barticulo      = require('../../../controller/modules/st/movimiento/STENVIO/buscador/getArticulo'        );
const bum            = require('../../../controller/modules/st/movimiento/STENVIO/buscador/getUm'              );
const bcausa         = require('../../../controller/modules/st/movimiento/STENVIO/buscador/getCausa'           );
// VALIDADORES
const vsucursal      = require('../../../controller/modules/st/movimiento/STENVIO/validador/validaSucursal'    );
const vmotivo        = require('../../../controller/modules/st/movimiento/STENVIO/validador/validaMotivo'      );
const varticulo      = require('../../../controller/modules/st/movimiento/STENVIO/validador/validaArticulo'    );
const vdeposito      = require('../../../controller/modules/st/movimiento/STENVIO/validador/validaDeposito'    );
const vdeposito_ent  = require('../../../controller/modules/st/movimiento/STENVIO/validador/validaDepositoEnt' );
const vum            = require('../../../controller/modules/st/movimiento/STENVIO/validador/validaUm'          );
const vcantidad      = require('../../../controller/modules/st/movimiento/STENVIO/validador/validaCantidad'    );
const vcausa         = require('../../../controller/modules/st/movimiento/STENVIO/validador/validaCausa'       );
// LIST      
const lcabecera      = require('../../../controller/modules/st/movimiento/STENVIO/listar/listCab'              );
const ldetalle       = require('../../../controller/modules/st/movimiento/STENVIO/listar/listDet'              );
// ABM
const main           = require('../../../controller/modules/st/movimiento/STENVIO/main'                        );
// REPORTE
const rstenvio       = require('../../../controller/modules/st/movimiento/STENVIO/reporte/RSTENVIO'            );

module.exports = function(){
  // ABM
  router.get('/st/stenvio/:cod_empresa/:tip_comprobante/:ser_comprobante'                  , main.getNroComp );
  router.get('/st/stenvio/:cod_empresa/:tip_comprobante/:ser_comprobante/:nro_comprobante' , main.getNrOrden );
  router.post('/st/stenvio'                     , main.main           );
  // // LIST
  router.post('/st/stenvio/list/cabecera'       , lcabecera.main      );
  router.post('/st/stenvio/list/detalle'        , ldetalle.main       );
  // BUSCADORES  
  router.post('/st/stenvio/buscar/sucursal'     , bsucursal.main      );
  router.post('/st/stenvio/buscar/motivo'       , bmotivo.main        );
  router.post('/st/stenvio/buscar/articulo'     , barticulo.main      );
  router.post('/st/stenvio/buscar/um'           , bum.main            );
  router.post('/st/stenvio/buscar/tipCambio'    , btipCambio.main     );
  router.post('/st/stenvio/buscar/causa'        , bcausa.main         );
  // VALIDADORES
  router.post('/st/stenvio/valida/sucursal'     , vsucursal.main      );
  router.post('/st/stenvio/valida/motivo'       , vmotivo.main        );
  router.post('/st/stenvio/valida/articulo'     , varticulo.main      );
  router.post('/st/stenvio/valida/deposito'     , vdeposito.main      );
  router.post('/st/stenvio/valida/deposito_ent' , vdeposito_ent.main  );  
  router.post('/st/stenvio/valida/um'           , vum.main            );
  router.post('/st/stenvio/valida/cantidad'     , vcantidad.main      );
  router.post('/st/stenvio/valida/causa'        , vcausa.main         );
  // REPORTE
  router.post('/st/stenvio/reporte/rstenvio'     , rstenvio.main       );
  

  return router;
}