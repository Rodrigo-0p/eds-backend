const { validateBooleanFunction } = require('../../../../../../../utils/validate');
const {log_error}                 = require('../../../../../../../utils/logger');
const _                           = require('underscore')

exports.main = async (req, res, next)  => {
const {COD_EMPRESA = '', COD_CLIENTE = '', TIP_COMPR_REF = ''} = req.body
let NRO_COMPR_REF  = req.body.valor ? req.body.valor : ''
let content 	     = [{COD_EMPRESA,COD_CLIENTE,TIP_COMPR_REF,NRO_COMPR_REF}];
let in_params  = content.map( item => { return _.keys(item) });  
var valida 		 = [{
    campo			 : 'COD_EMPRESA'         ,
    paquete		 : 'EDS_CCMOVCAJ.'      ,
    funcion		 : 'VALIDA_NRO_PLANILLA',
    in_params  : in_params[0]    ,
    out_params : [],
   }];
  try {
    var response = await validateBooleanFunction(content, valida, req);
    res.status(200).json(response.data);
  } catch (error) {
    log_error.error(`EDS_CCMOVCAJ: VALIDA_NRO_PLANILLA : ${error}`);
    console.error('EDS_CCMOVCAJ: VALIDA_NRO_PLANILLA   : ',error)
    next()
  }
  
}