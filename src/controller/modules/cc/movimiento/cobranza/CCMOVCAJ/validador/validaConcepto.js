const { validateBooleanFunction } = require('../../../../../../../utils/validate');
const {log_error}                 = require('../../../../../../../utils/logger');
const _                           = require('underscore')

exports.main = async (req, res, next)  => {
const {MONTO = ''} = req.body
let COD_CONCEPTO   = req.body.valor ? req.body.valor : ''
let content 	     = [{COD_CONCEPTO,MONTO}];

let in_params  = content.map( item => { return _.keys(item) });  
var valida 		 = [{
    campo			 : 'COD_CONCEPTO'   ,
    paquete		 : 'EDS_CCMOVCAJ.'  ,
    funcion		 : 'VALIDA_CONCEPTO',
    in_params  : in_params[0]     ,
    out_params : [],
   }];
  try {
    var response = await validateBooleanFunction(content, valida, req);
    res.status(200).json(response.data);
  } catch (error) {
    log_error.error(`EDS_CCMOVCAJ: VALIDA_CONCEPTO : ${error}`);
    console.error('EDS_CCMOVCAJ: VALIDA_CONCEPTO   : ',error)
    next()
  }
  
}