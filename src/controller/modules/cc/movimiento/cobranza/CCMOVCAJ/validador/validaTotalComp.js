const { validateBooleanFunction } = require('../../../../../../../utils/validate');
const {log_error}                 = require('../../../../../../../utils/logger');
const _                           = require('underscore')

exports.main = async (req, res, next)  => {
const {COD_MONEDA_CAB  = '', TIP_CAMBIO_CAB  = '', COD_MONEDA_REF = '', TIP_CAMBIO_REF = '',
       TOT_COMPROBANTE = '', TOT_NRO_MOV_CAJ = '', IMPORTE_ANT    = 0} = req.body
let content 	     = [{ COD_MONEDA_CAB
                      , COD_MONEDA_REF
                      , TIP_CAMBIO_CAB
                      , TIP_CAMBIO_REF
                      , TOT_COMPROBANTE
                      , TOT_NRO_MOV_CAJ
                      , IMPORTE_ANT}];                
let in_params  = content.map( item => { return _.keys(item) });  
var valida 		 = [{
    campo			 : 'COD_MONEDA_CAB'        ,
    paquete		 : 'EDS_CCMOVCAJ.'         ,
    funcion		 : 'VALIDA_TOT_COMPR'      ,
    in_params  : in_params[0]            ,
    bind_type  : {'TOT_NRO_MOV_CAJ':'INOUT'
                 ,'IMPORTE_ANT'    :'INOUT' },
    in_type    : {'TOT_NRO_MOV_CAJ':'NUMBER' ,        
                  'IMPORTE_ANT'    :'NUMBER'},    
    out_params : ['IMPORTE']                 ,
    out_type   : {'IMPORTE'        :'NUMBER'}
   }];
  try {
    var response = await validateBooleanFunction(content, valida, req);
    res.status(200).json(response.data.outBinds ? response.data.outBinds : response);
  } catch (error) {
    log_error.error(`EDS_CCMOVCAJ: VALIDA_TOT_COMPR : ${error}`);
    console.error('EDS_CCMOVCAJ: VALIDA_TOT_COMPR   : ',error)
    next()
  }
  
}