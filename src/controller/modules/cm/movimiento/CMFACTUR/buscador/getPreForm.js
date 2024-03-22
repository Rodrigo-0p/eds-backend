const { validateProcedure } = require('../../../../../../utils/validate');
const {log_error}           = require('../../../../../../utils/logger');
const _                     = require('underscore')

exports.main = async (req, res, next)  => {

  let {COD_EMPRESA = '', COD_SUCURSAL='', FORMNAME=''} = req.body;

  let content = [{COD_EMPRESA,FORMNAME,COD_SUCURSAL}];
  
  let in_params = content.map( item => { return _.keys(item) });  
  var valida  = [{
    campo       : 'COD_EMPRESA'        ,
    paquete     : 'EDS_CMFACTUR'       ,
    funcion     : 'PRE_FORM',
    in_params   : in_params[0]         ,
    out_params: [   'TIP_COMPROBANTE'
                  , 'SER_COMPROBANTE'
                  , 'COD_MONEDA_BASE'
                  , 'TIP_PEDIDO'
                  , 'SER_PEDIDO'
                  , 'TIP_PROFORMA'
                  , 'SER_PROFORMA'
                  , 'REFERENCIA_ANT'
                  , 'COD_MONEDA_REAL'
                  , 'COD_MONEDA_DOL'
                  , 'TIP_COMPROBANTE_'
                  , 'SER_COMPROBANTE_C'
                  , 'PERMITE_AUTORIZA'
                  , 'CAMBIA_NRO_COMPR'
                  , 'CAMBIA_SUCURSAL'
                  , 'CARGA_PRECIOS'
                  , 'CARGA_DESCUENTOS'
                  , 'CARGA_COTIZACI'
                  , 'CARGA_CONDICION'
                  , 'CANT_DIA_RECEPCI'
                  , 'CANT_DIA_COMPROBANTE'
                  , 'TIP_CAMBIO'
                  , 'TIP_CAMBIO_US'
                  , 'TIP_CAMBIO_RS'
                  , 'IND_TIMBRADO'
									, 'AFECTA_COSTO'
                ],
  out_type   : {TIP_CAMBIO_US:'NUMBER',TIP_CAMBIO_RS:'NUMBER',TIP_CAMBIO:'NUMBER'},
  }];  
  try {
    var response = await validateProcedure(content, valida, req);
    res.status(200).json(response.outBinds); 
  } catch (error) {
    next()
    log_error.error(`[EDS_CMFACTUR] list PRE_FORM ${error}`)
  }
}