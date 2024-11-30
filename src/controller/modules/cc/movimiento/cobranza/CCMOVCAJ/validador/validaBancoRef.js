const { validateBooleanFunction } = require('../../../../../../../utils/validate');
const {log_error}                 = require('../../../../../../../utils/logger');
const _                           = require('underscore')

exports.main = async (req, res, next)  => {
const {COD_EMPRESA = '', CARGA_BANCO_CLI} = req.body
let COD_BANCO_CLIENTE = req.body.valor ? req.body.valor : ''
let content 	        = [{COD_EMPRESA, COD_BANCO_CLIENTE, CARGA_BANCO_CLI}];
let in_params  = content.map( item => { return _.keys(item) });  
var valida 		 = [{
    campo			 : 'COD_EMPRESA'      ,
    paquete		 : 'EDS_CCMOVCAJ.'    ,
    funcion		 : 'VALIDA_BANCO_REF' ,
    in_params  : in_params[0]       ,
    out_params : ['COD_BANCO_REF','DESC_BANCO'],
   }];
  try {
    var response = await validateBooleanFunction(content, valida, req);
    res.status(200).json(response.data.outBinds ? response.data.outBinds : response);
  } catch (error) {
    log_error.error(`EDS_CCMOVCAJ: VALIDA_BANCO_REF : ${error}`);
    console.error('EDS_CCMOVCAJ: VALIDA_BANCO_REF   : ',error)
    next()
  }
  
}