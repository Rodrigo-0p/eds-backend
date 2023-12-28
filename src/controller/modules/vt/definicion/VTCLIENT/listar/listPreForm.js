const { validateProcedure } = require('../../../../../../utils/validate');
const {log_error}           = require('../../../../../../utils/logger');
const _                     = require('underscore')

exports.main = async (req, res, next)  => {
  
  let { COD_EMPRESA, COD_USUARIO  , FORMNAME  } = req.body;

  let content = [{ COD_EMPRESA, COD_USUARIO  , FORMNAME  }];
  let in_params = content.map( item => { return _.keys(item) });  
  var valida = [{
    campo     : 'COD_EMPRESA',
    paquete   : 'EDS_VTCLIENT',
    funcion   : 'PRE_FORM',
    in_params : in_params[0] ,
    out_params: ['BLOQUEAR_CLIENTE','CAD_LIMITE_SUPERIOR','LIMITE_CREDITO_ANT','COD_MONEDA_LIMITE','DESC_MONEDA_LIMITE'],
    out_type  : { LIMITE_CREDITO : 'NUMBER'},
  }];  

  try {
    var response = await validateProcedure(content, valida, req);
    res.status(200).json(response.outBinds); 
  } catch (error) {
    next()
    log_error.error(`[EDS_VTCLIENT] list PRE_FORM CAB: ${error}`)
  }
}