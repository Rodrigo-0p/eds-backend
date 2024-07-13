const express = require('express');
const router  = express.Router();
const ccnrdef = '/cc/ccncrdef'

// List
const lcabecera   = require('../../../../../controller/modules/cc/movimiento/cobranza/notaDeCredito/CCNCRDEF/listar/listCab'               );
const ldetalle    = require('../../../../../controller/modules/cc/movimiento/cobranza/notaDeCredito/CCNCRDEF/listar/listDet'               );
const lpostQuery  = require('../../../../../controller/modules/cc/movimiento/cobranza/notaDeCredito/CCNCRDEF/listar/listPostQueryCab'      );
// Buscar
const bpreForm    = require('../../../../../controller/modules/cc/movimiento/cobranza/notaDeCredito/CCNCRDEF/buscador/getPreForm'          );
const bsucursal   = require('../../../../../controller/modules/cc/movimiento/cobranza/notaDeCredito/CCNCRDEF/buscador/getSucursal'         );
const bcliente    = require('../../../../../controller/modules/cc/movimiento/cobranza/notaDeCredito/CCNCRDEF/buscador/getCliente'          );
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

module.exports = function(){
  
  // LISTAR
  router.post(`${ccnrdef}/list/cabecera`      , lcabecera.main   );
  router.post(`${ccnrdef}/list/detalle`       , ldetalle.main    );
  router.post(`${ccnrdef}/list/postquery`     , lpostQuery.main  );

  // BUSCAR
  router.post(`${ccnrdef}/buscar/preform`     , bpreForm.main    );
  router.post(`${ccnrdef}/buscar/sucursal`    , bsucursal.main   );
  router.post(`${ccnrdef}/buscar/cliente`     , bcliente.main    );
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
  return router;
}