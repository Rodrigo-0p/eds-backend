const { validateBooleanFunction } = require('../../../../../../../utils/validate');
const {log_error}                 = require('../../../../../../../utils/logger');
const _                           = require('underscore')

exports.main = async (req, res, next)  => {
const {COD_MONEDA_CAB = '', COD_MONEDA_REF = '', TIP_CAMBIO = ''} = req.body
let content 	     = [{COD_MONEDA_CAB,COD_MONEDA_REF,TIP_CAMBIO}];
let in_params  = content.map( item => { return _.keys(item) });  
var valida 		 = [{
    campo			 : 'COD_MONEDA_CAB'      ,
    paquete		 : 'EDS_CCMOVCAJ.'       ,
    funcion		 : 'VALIDA_NRO_CUOTA'    ,
    in_params  : in_params[0]          ,
    bind_type  : {'TIP_CAMBIO':'INOUT' },
    in_type    : {'TIP_CAMBIO':'NUMBER'},
    out_params : ['CARGARCAB']         ,
   }];
  try {
    var response = await validateBooleanFunction(content, valida, req);
    res.status(200).json(response.data.outBinds ? response.data.outBinds : response);
  } catch (error) {
    log_error.error(`EDS_CCMOVCAJ: VALIDA_NRO_CUOTA : ${error}`);
    console.error('EDS_CCMOVCAJ: VALIDA_NRO_CUOTA   : ',error)
    next()
  }
  
}