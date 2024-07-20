const { validateProcedure } = require('../../../../../../../../utils/validate');
const {log_error}           = require('../../../../../../../../utils/logger');
const _                     = require('underscore')

exports.main = async (req, res, next)  => {
  
  let { COD_EMPRESA  ='', COD_SUCURSAL     = '', TIP_COMPROBANTE  = '', SER_COMPROBANTE     = '', NRO_COMPROBANTE = '',
        COD_VENDEDOR ='', VENDEDOR_PERSONA = '', COD_LISTA_PRECIO = '', COD_CONDICION_VENTA = '', COD_MONEDA = '',
        COD_DEPOSITO ='', COD_ZONA         = '', COD_MOTIVO_NCR   = '',
      } = req.body;
      
  let content = [{ COD_EMPRESA  , COD_SUCURSAL     , TIP_COMPROBANTE , SER_COMPROBANTE    , NRO_COMPROBANTE,
                   COD_VENDEDOR , VENDEDOR_PERSONA , COD_LISTA_PRECIO, COD_CONDICION_VENTA, COD_MONEDA     , 
                   COD_DEPOSITO , COD_ZONA         , COD_MOTIVO_NCR  ,}];
                   
  let in_params = content.map( item => { return _.keys(item) });  
  var valida = [{
  campo     : 'COD_EMPRESA',
  paquete   : 'EDS_CCNCRDEF',
  funcion   : 'POST_QUERY_CABECERA',
  in_params : in_params[0] ,
  out_params: [ 'DESC_SUCURSAL'
              , 'DESC_VENDEDOR'
              , 'DESC_LISTA_PRECIO'
              , 'DESC_CONDICION'
              , 'DESC_MONEDA'
              , 'DESC_DEPOSITO'
              , 'DECIMALES'
              , 'DESC_ZONA'
              , 'DESC_MOTIVO_NCR'
              , 'IVA5'
              , 'IVA10'
              , 'GRAV5'
              , 'GRAV10'
              , 'SUBTOTAL'
              , 'USA_IMP_LASER'
            ]      
  }];
  try {
    var response = await validateProcedure(content, valida, req);
    res.status(200).json(response.outBinds); 
  } catch (error) {
    next()
    log_error.error(`[EDS_CCNCRDEF] list POSTQUERY CAB: ${error}`)
  }
}