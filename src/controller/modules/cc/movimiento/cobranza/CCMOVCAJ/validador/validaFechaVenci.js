const { validateBooleanFunction } = require('../../../../../../../utils/validate');
const {log_error}                 = require('../../../../../../../utils/logger');
const _                           = require('underscore')

exports.main = async (req, res, next)  => {
const {CARGA_VENCIMIENTO = ''} = req.body
let FEC_VENCIMIENTO = req.body.valor ? req.body.valor : ''
let content 	      = [{CARGA_VENCIMIENTO,FEC_VENCIMIENTO}];
let in_params  = content.map( item => { return _.keys(item) });  
var valida 		 = [{
    campo			 : 'FEC_VENCIMIENTO'  ,
    paquete		 : 'EDS_CCMOVCAJ.'    ,
    funcion		 : 'VALIDA_FECHA_VENC',
    in_params  : in_params[0]       ,
    out_params : [],
   }];
  try {
    var response = await validateBooleanFunction(content, valida, req);
    res.status(200).json(response.data.outBinds ? response.data.outBinds : response);
  } catch (error) {
    log_error.error(`EDS_CCMOVCAJ: VALIDA_CLIENTE_ACT : ${error}`);
    console.error('EDS_CCMOVCAJ: VALIDA_CLIENTE_ACT   : ',error)
    next()
  }
}