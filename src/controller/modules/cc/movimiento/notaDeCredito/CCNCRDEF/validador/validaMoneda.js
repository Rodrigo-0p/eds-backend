const { validateBooleanFunction } = require('../../../../../../../utils/validate');
const {log_error}                 = require('../../../../../../../utils/logger');
const _                           = require('underscore')

exports.main = async (req, res, next)  => {

let COD_MONEDA   = req.body.valor ? req.body.valor : ''
let content 	 = [{COD_MONEDA}];
let in_params  = content.map( item => { return _.keys(item) });  
var valida 		 = [{
    campo			 : 'COD_MONEDA'        ,
    paquete		 : 'EDS_CCNCRDEF.'      ,
    funcion		 : 'VALIDA_MONEDA'      ,
    in_params  : in_params[0]         ,
    out_params : [ 'DESC_MONEDA', 'DECIMALES', 'TIP_CAMBIO'],
   }];
  try {
    var response = await validateBooleanFunction(content, valida, req);
    res.status(200).json(response.data);
  } catch (error) {
    log_error.error(`EDS_CCNCRDEF: VALIDA_LISTA_PRECIO : ${error}`);
    console.error('EDS_CCNCRDEF: VALIDA_LISTA_PRECIO   : ',error)
    next()
  }
  
}