const express = require('express');
const router  = express.Router();

// BUSCADORES 
const bpreForm   = require('../../../controller/modules/cm/movimiento/CMFACTUR/buscador/getPreForm'         );
const bsucursal  = require('../../../controller/modules/cm/movimiento/CMFACTUR/buscador/getSucursal'        );
const bproveedor = require('../../../controller/modules/cm/movimiento/CMFACTUR/buscador/getProveedor'       );
const bProveeAnt = require('../../../controller/modules/cm/movimiento/CMFACTUR/buscador/getProveedorAnt'    );
const bCondCompr = require('../../../controller/modules/cm/movimiento/CMFACTUR/buscador/getCondCompra'      );
const bmoneda    = require('../../../controller/modules/cm/movimiento/CMFACTUR/buscador/getMoneda'          );
const bDeposito  = require('../../../controller/modules/cm/movimiento/CMFACTUR/buscador/getDeposito'        );
const barticulo  = require('../../../controller/modules/cm/movimiento/CMFACTUR/buscador/getArticulo'        );
const bProvRec   = require('../../../controller/modules/cm/movimiento/CMFACTUR/buscador/getCodProvRec'      );
const bumedida   = require('../../../controller/modules/cm/movimiento/CMFACTUR/buscador/getUnidadMedida'    );
// LIST
const ldetalle   = require('../../../controller/modules/cm/movimiento/CMFACTUR/listar/listDet'              );
const lcabecera  = require('../../../controller/modules/cm/movimiento/CMFACTUR/listar/listCab'              );
// VALIDADORES
const vsucursal  = require('../../../controller/modules/cm/movimiento/CMFACTUR/validador/validaSucursal'    );
const vproveedor = require('../../../controller/modules/cm/movimiento/CMFACTUR/validador/validaProveedor'   );
const vFecComprb = require('../../../controller/modules/cm/movimiento/CMFACTUR/validador/validaFecComprobante');
const vProveeAnt = require('../../../controller/modules/cm/movimiento/CMFACTUR/validador/validaProveedorAnt');
const vCondCompr = require('../../../controller/modules/cm/movimiento/CMFACTUR/validador/validaCondCompra'  );
const vmoneda    = require('../../../controller/modules/cm/movimiento/CMFACTUR/validador/validaMoneda'      );
const vDeposito  = require('../../../controller/modules/cm/movimiento/CMFACTUR/validador/validaDeposito'    );
const vreferenc  = require('../../../controller/modules/cm/movimiento/CMFACTUR/validador/validaReferencia'  );
const varticulo  = require('../../../controller/modules/cm/movimiento/CMFACTUR/validador/validaArticulo'    );
const vprovRec   = require('../../../controller/modules/cm/movimiento/CMFACTUR/validador/validaCodProvRec'  );
const vumedida   = require('../../../controller/modules/cm/movimiento/CMFACTUR/validador/validaUnidadMedida');
// MAIN CMFACTUR
const main       = require('../../../controller/modules/cm/movimiento/CMFACTUR/main');

module.exports = function(){
  // NRO_ORDEN AND NRO_COMPROBANTE
  router.get('/cm/cmfactur/cab/:cod_empresa/:ser_comprobante/:tip_comprobante'                    , main.getNroComp);
  router.get('/cm/cmfactur/det/:cod_empresa/:ser_comprobante/:tip_comprobante/:nro_comprobante'   , main.getNrOrden);
  // Buscadores
  router.post('/cm/cmfactur/preform'            , bpreForm.main    );
  router.post('/cm/cmfactur/buscar/sucursal'    , bsucursal.main   );
  router.post('/cm/cmfactur/buscar/proveedor'   , bproveedor.main  );
  router.post('/cm/cmfactur/buscar/prov_ant'    , bProveeAnt.main  );
  router.post('/cm/cmfactur/buscar/condCompra'  , bCondCompr.main  );
  router.post('/cm/cmfactur/buscar/condmoneda'  , bmoneda.main     );
  router.post('/cm/cmfactur/buscar/deposito'    , bDeposito.main   );
  router.post('/cm/cmfactur/buscar/articulo'    , barticulo.main   );
  router.post('/cm/cmfactur/buscar/codProvRec'  , bProvRec.main    );
  router.post('/cm/cmfactur/buscar/unidadMedida', bumedida.main    );
  
  // list
  router.post('/cm/cmfactur/list/detalle'       , ldetalle.main    );
  router.post('/cm/cmfactur/list/cabecera'      , lcabecera.main   );
  // validadores
  router.post('/cm/cmfactur/valida/sucursal'    , vsucursal.main   );
  router.post('/cm/cmfactur/valida/proveedor'   , vproveedor.main  );
  router.post('/cm/cmfactur/valida/nro_comprb'  , vFecComprb.main  );
  router.post('/cm/cmfactur/valida/prov_ant'    , vProveeAnt.main  );
  router.post('/cm/cmfactur/valida/condcompra'  , vCondCompr.main  );
  router.post('/cm/cmfactur/valida/condmoneda'  , vmoneda.main     );
  router.post('/cm/cmfactur/valida/deposito'    , vDeposito.main   );
  router.post('/cm/cmfactur/valida/referencia'  , vreferenc.main   );
  router.post('/cm/cmfactur/valida/articulo'    , varticulo.main   );
  router.post('/cm/cmfactur/valida/codProvRec'  , vprovRec.main    );
  router.post('/cm/cmfactur/valida/unidadMedida', vumedida.main    );
  // ABM
  router.post('/cm/cmfactur'                    , main.main        );
  
  return router;
}