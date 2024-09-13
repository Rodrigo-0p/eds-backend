const { validateProcedure } = require('../../../../../../../utils/validate');
const {log_error}           = require('../../../../../../../utils/logger');
const _                     = require('underscore')

exports.main = async (req, res, next)  => {

  let content   = [{COD_MODULO:'CC'}];
  let in_params = content.map( item => { return _.keys(item) });
  var valida    = [{
    campo       : 'COD_MODULO'  ,
    paquete     : 'EDS_CCCANCAJ',
    funcion     : 'PRE_FORM'    ,
    in_params   : in_params[0]  ,
    out_params  : ['CLIENTE_OCA']
  }];  
  try {
    var response = await validateProcedure(content, valida, req);
    res.status(200).json(response.outBinds); 
  } catch (error) {
    next()
    log_error.error(`[EDS_CCCANCAJ] list PRE_FORM ${error}`);
  }
}