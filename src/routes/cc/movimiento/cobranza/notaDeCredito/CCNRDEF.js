const express = require('express');
const router  = express.Router();
const ccnrdef = '/cc/ccncrdef'

// List
const lcabecera   = require('../../../../../controller/modules/cc/movimiento/cobranza/notaDeCredito/CCNCRDEF/listar/listCab'               );
const ldetalle    = require('../../../../../controller/modules/cc/movimiento/cobranza/notaDeCredito/CCNCRDEF/listar/listDet'               );
const lpostQuery  = require('../../../../../controller/modules/cc/movimiento/cobranza/notaDeCredito/CCNCRDEF/listar/listPostQueryCab'      );
const lprov       = require('../../../../../controller/modules/cc/movimiento/cobranza/notaDeCredito/CCNCRDEF/listar/carga_detalle_not_prov');
const ldef        = require('../../../../../controller/modules/cc/movimiento/cobranza/notaDeCredito/CCNCRDEF/listar/carga_detalle_not_def' );
const lapv        = require('../../../../../controller/modules/cc/movimiento/cobranza/notaDeCredito/CCNCRDEF/listar/carga_detalle_apv'     );
// Buscar
const bpreForm    = require('../../../../../controller/modules/cc/movimiento/cobranza/notaDeCredito/CCNCRDEF/buscador/getPreForm'          );
const bsucursal   = require('../../../../../controller/modules/cc/movimiento/cobranza/notaDeCredito/CCNCRDEF/buscador/getSucursal'         );
const bcliente    = require('../../../../../controller/modules/cc/movimiento/cobranza/notaDeCredito/CCNCRDEF/buscador/getCliente'          );
const bzona       = require('../../../../../controller/modules/cc/movimiento/cobranza/notaDeCredito/CCNCRDEF/buscador/getZona'             );
const bNroCompro  = require('../../../../../controller/modules/cc/movimiento/cobranza/notaDeCredito/CCNCRDEF/buscador/getNroCompRef'       );
const bCondVenta  = require('../../../../../controller/modules/cc/movimiento/cobranza/notaDeCredito/CCNCRDEF/buscador/getCondVente'        );
const bMotivoNcr  = require('../../../../../controller/modules/cc/movimiento/cobranza/notaDeCredito/CCNCRDEF/buscador/getMotivoncr'        );
const bListaPrec  = require('../../../../../controller/modules/cc/movimiento/cobranza/notaDeCredito/CCNCRDEF/buscador/getListaPrecio'      );
const bvendedor   = require('../../../../../controller/modules/cc/movimiento/cobranza/notaDeCredito/CCNCRDEF/buscador/getVendedor'         );
const bmoneda     = require('../../../../../controller/modules/cc/movimiento/cobranza/notaDeCredito/CCNCRDEF/buscador/getMoneda'           );
const barticulo   = require('../../../../../controller/modules/cc/movimiento/cobranza/notaDeCredito/CCNCRDEF/buscador/getArticulo'         );
const bunidaMed   = require('../../../../../controller/modules/cc/movimiento/cobranza/notaDeCredito/CCNCRDEF/buscador/getUnidadMedida'     );
// valida
const vsucursal   = require('../../../../../controller/modules/cc/movimiento/cobranza/notaDeCredito/CCNCRDEF/validador/validaSucursal'     );
const vcliente    = require('../../../../../controller/modules/cc/movimiento/cobranza/notaDeCredito/CCNCRDEF/validador/validaCliente'      );
const vNroCompro  = require('../../../../../controller/modules/cc/movimiento/cobranza/notaDeCredito/CCNCRDEF/validador/valiaNroCompRef'    );
const vsubcliente = require('../../../../../controller/modules/cc/movimiento/cobranza/notaDeCredito/CCNCRDEF/validador/validaSubCliente'   );
const vzona       = require('../../../../../controller/modules/cc/movimiento/cobranza/notaDeCredito/CCNCRDEF/validador/validaZona'         );
const vCondVenta  = require('../../../../../controller/modules/cc/movimiento/cobranza/notaDeCredito/CCNCRDEF/validador/validaCondVenta'    );
const vMotivoNcr  = require('../../../../../controller/modules/cc/movimiento/cobranza/notaDeCredito/CCNCRDEF/validador/validaMotivoNcr'    );
const vListaPrec  = require('../../../../../controller/modules/cc/movimiento/cobranza/notaDeCredito/CCNCRDEF/validador/validaListaPrecio'  );
const vvendedor   = require('../../../../../controller/modules/cc/movimiento/cobranza/notaDeCredito/CCNCRDEF/validador/validaVendedor'     );
const vmoneda     = require('../../../../../controller/modules/cc/movimiento/cobranza/notaDeCredito/CCNCRDEF/validador/validaMoneda'       );
const varticulo   = require('../../../../../controller/modules/cc/movimiento/cobranza/notaDeCredito/CCNCRDEF/validador/validaupArticulo'   );
const vunidaMed   = require('../../../../../controller/modules/cc/movimiento/cobranza/notaDeCredito/CCNCRDEF/validador/validaUnidaMed'     );
const vcantidad   = require('../../../../../controller/modules/cc/movimiento/cobranza/notaDeCredito/CCNCRDEF/validador/validaCantidad'     );
const vcalculAct  = require('../../../../../controller/modules/cc/movimiento/cobranza/notaDeCredito/CCNCRDEF/validador/up_calculo_actual'  );
const vestado     = require('../../../../../controller/modules/cc/movimiento/cobranza/notaDeCredito/CCNCRDEF/validador/up_estado'          );
const main        = require('../../../../../controller/modules/cc/movimiento/cobranza/notaDeCredito/CCNCRDEF/main'                         );

module.exports = function(){
  
  // NRO_ORDEN AND NRO_COMPROBANTE
  router.get(`${ccnrdef}/cab/:cod_empresa/:ser_comprobante/:tip_comprobante`                    , main.getNroComp);
  router.get(`${ccnrdef}/det/:cod_empresa/:ser_comprobante/:tip_comprobante/:nro_comprobante`   , main.getNrOrden);
  router.post(`${ccnrdef}`                    , main.main        );
  // LISTAR
  router.post(`${ccnrdef}/list/cabecera`      , lcabecera.main   );
  router.post(`${ccnrdef}/list/detalle`       , ldetalle.main    );
  router.post(`${ccnrdef}/list/postquery`     , lpostQuery.main  );

  router.post(`${ccnrdef}/list/prov`          , lprov.main       );
  router.post(`${ccnrdef}/list/def`           , ldef.main        );
  router.post(`${ccnrdef}/list/apv`           , lapv.main        );

  // BUSCAR
  router.post(`${ccnrdef}/buscar/preform`     , bpreForm.main    );
  router.post(`${ccnrdef}/buscar/sucursal`    , bsucursal.main   );
  router.post(`${ccnrdef}/buscar/cliente`     , bcliente.main    );
  router.post(`${ccnrdef}/buscar/zona`        , bzona.main       );
  router.post(`${ccnrdef}/buscar/nroCompr`    , bNroCompro.main  );
  router.post(`${ccnrdef}/buscar/condVenta`   , bCondVenta.main  );
  router.post(`${ccnrdef}/buscar/motivoNcr`   , bMotivoNcr.main  );
  router.post(`${ccnrdef}/buscar/listPrecio`  , bListaPrec.main  );
  router.post(`${ccnrdef}/buscar/vendedor`    , bvendedor.main   );
  router.post(`${ccnrdef}/buscar/moneda`      , bmoneda.main     );
  router.post(`${ccnrdef}/buscar/articulo`    , barticulo.main   );
  router.post(`${ccnrdef}/buscar/um`          , bunidaMed.main   );

  // VALIDA
  router.post(`${ccnrdef}/valida/sucursal`    , vsucursal.main   );
  router.post(`${ccnrdef}/valida/cliente`     , vcliente.main    );
  router.post(`${ccnrdef}/valida/nroCompr`    , vNroCompro.main  );
  router.post(`${ccnrdef}/valida/subcliente`  , vsubcliente.main );
  router.post(`${ccnrdef}/valida/zona`        , vzona.main       );
  router.post(`${ccnrdef}/valida/condVenta`   , vCondVenta.main  );
  router.post(`${ccnrdef}/valida/motivoNcr`   , vMotivoNcr.main  );
  router.post(`${ccnrdef}/valida/listPrecio`  , vListaPrec.main  );
  router.post(`${ccnrdef}/valida/vendedor`    , vvendedor.main   );
  router.post(`${ccnrdef}/valida/moneda`      , vmoneda.main     );
  router.post(`${ccnrdef}/valida/articulo`    , varticulo.main   );
  router.post(`${ccnrdef}/valida/um`          , vunidaMed.main   );
  router.post(`${ccnrdef}/valida/cantidad`    , vcantidad.main   );
  router.post(`${ccnrdef}/valida/calculoAct`  , vcalculAct.main  );
  router.post(`${ccnrdef}/valida/estado`      , vestado.main     );
  
  return router;
}