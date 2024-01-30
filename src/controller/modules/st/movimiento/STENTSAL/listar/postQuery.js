const { validateProcedure } = require('../../../../../../utils/validate');
const {log_error}           = require('../../../../../../utils/logger');
const _                     = require('underscore')

exports.main = async (req, res, next)  => {

  let { COD_EMPRESA   = ''
      , COD_SUCURSAL  = ''
      , COD_DEPOSITO  = ''
      , COD_MONEDA    = ''
      , COD_MOTIVO    = ''
      , COD_PROVEEDOR = ''
      , TIP_ENT_SAL   = ''
      , SER_ENT_SAL   = ''
      , NRO_ENT_SAL   = ''
     } = req.body;

  let content = [{  COD_EMPRESA,COD_SUCURSAL,COD_DEPOSITO,COD_MONEDA,COD_MOTIVO,COD_PROVEEDOR,TIP_ENT_SAL,SER_ENT_SAL,NRO_ENT_SAL }];
  
  let in_params = content.map( item => { return _.keys(item) });  
  var valida  = [{
    campo       : 'COD_EMPRESA'        ,
    paquete     : 'EDS_STENTSAL'       ,
    funcion     : 'POST_QUERY_CABECERA',
    in_params   : in_params[0]         ,
    out_params: [   'DESC_SUCURSAL'
                  , 'DESC_DEPOSITO'
                  , 'DESC_MONEDA'
                  , 'DESC_MOTIVO'
                  , 'DESC_PROVEEDOR'
                  , 'DECIMALES'
                  , 'TOTAL'
                ],
  }];  
  try {
    var response = await validateProcedure(content, valida, req);
    res.status(200).json(response.outBinds); 
  } catch (error) {
    next()
    log_error.error(`[EDS_STENSAL] list POSTQUERY CAB: ${error}`)
  }
}