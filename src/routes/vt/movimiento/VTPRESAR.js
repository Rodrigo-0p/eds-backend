const express = require('express');
const router  = express.Router();

// BUSCADORES
const bvendedor   = require('../../../controller/modules/vt/movimiento/VTPRESAR/buscador/getVendedor'        );
const bcondVent   = require('../../../controller/modules/vt/movimiento/VTPRESAR/buscador/getCondVenta'       );
const bcliente    = require('../../../controller/modules/vt/movimiento/VTPRESAR/buscador/getCliente'         );
const bMoneda     = require('../../../controller/modules/vt/movimiento/VTPRESAR/buscador/getMoneda'          );
const blprecio    = require('../../../controller/modules/vt/movimiento/VTPRESAR/buscador/getListaPrecio'     );
const barticulo   = require('../../../controller/modules/vt/movimiento/VTPRESAR/buscador/getArticulo'        );
const bunidadMe   = require('../../../controller/modules/vt/movimiento/VTPRESAR/buscador/getUnidadMedida'    );
// VALIDADORES
const vcliente    = require('../../../controller/modules/vt/movimiento/VTPRESAR/validador/validaCliente'     );
const vvendedor   = require('../../../controller/modules/vt/movimiento/VTPRESAR/validador/validaVendedor'    );
const vcondVent   = require('../../../controller/modules/vt/movimiento/VTPRESAR/validador/validaCondVenta'   );
const vcondMone   = require('../../../controller/modules/vt/movimiento/VTPRESAR/validador/validaMoneda'      );
const vlistPrec   = require('../../../controller/modules/vt/movimiento/VTPRESAR/validador/validaListaPrecio' );
const varticulo   = require('../../../controller/modules/vt/movimiento/VTPRESAR/validador/validaArticulo'    );
const vunidadme   = require('../../../controller/modules/vt/movimiento/VTPRESAR/validador/validaUnidadM'     );
const vestado     = require('../../../controller/modules/vt/movimiento/VTPRESAR/validador/validaEstado'      );
const vestadoCorr = require('../../../controller/modules/vt/movimiento/VTPRESAR/validador/validaEstadoCorreo');
// LIST      
const lcabecera   = require('../../../controller/modules/vt/movimiento/VTPRESAR/listar/listCab'              );
const ldetalle    = require('../../../controller/modules/vt/movimiento/VTPRESAR/listar/listDet'              );
// Main
const main        = require('../../../controller/modules/vt/movimiento/VTPRESAR/main'                        );
// REPORTE
const rvtpresup   = require('../../../controller/modules/vt/movimiento/VTPRESAR/reporte/VTPRESUP'            );

module.exports = function(){
  
  // NRO_ORDEN AND NRO_COMPROBANTE
  router.get('/vt/vtpresar/cab/:cod_empresa/:ser_comprobante/:tip_comprobante'                    , main.getNroComp);
  router.get('/vt/vtpresar/det/:cod_empresa/:ser_comprobante/:tip_comprobante/:nro_comprobante'   , main.getNrOrden);
  // ABM
  router.post('/vt/vtpresar'                     , main.main);
  // REPORTE
  router.post('/vt/vtpresar/reporte/vtpresup'    , rvtpresup.main   );
  // BUSCADORES
  router.post('/vt/vtpresar/buscar/cod_clien'    , bcliente.main    );
  router.post('/vt/vtpresar/buscar/vendedor'     , bvendedor.main   );
  router.post('/vt/vtpresar/buscar/cod_vent'     , bcondVent.main   );
  router.post('/vt/vtpresar/buscar/moneda'       , bMoneda.main     );
  router.post('/vt/vtpresar/buscar/listPrecio'   , blprecio.main    );
  router.post('/vt/vtpresar/buscar/articulo'     , barticulo.main   );
  router.post('/vt/vtpresar/buscar/unidadm'      , bunidadMe.main   );
  
  // VALIDADORES
  router.post('/vt/vtpresar/valida/vendedor'     , vvendedor.main   );  
  router.post('/vt/vtpresar/valida/cod_vent'     , vcondVent.main   );  
  router.post('/vt/vtpresar/valida/cod_clien'    , vcliente.main    );
  router.post('/vt/vtpresar/valida/moneda'       , vcondMone.main   ); 
  router.post('/vt/vtpresar/valida/listPrecio'   , vlistPrec.main   );   
  router.post('/vt/vtpresar/valida/articulo'     , varticulo.main   );    
  router.post('/vt/vtpresar/valida/unidadm'      , vunidadme.main   );    
  router.post('/vt/vtpresar/valida/estado'       , vestado.main     );    
  router.post('/vt/vtpresar/valida/estadoCorreo' , vestadoCorr.main );    
  
  // LISTAR   
  router.post('/vt/vtpresar/listar/cabecera'     , lcabecera.main   );  
  router.post('/vt/vtpresar/listar/detalle'      , ldetalle.main    );  
  return router;
}