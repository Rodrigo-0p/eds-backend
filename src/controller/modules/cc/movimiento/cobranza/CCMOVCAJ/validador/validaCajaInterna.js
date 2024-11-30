const { validateBooleanFunction } = require('../../../../../../../utils/validate');
const {log_error}                 = require('../../../../../../../utils/logger');
const _                           = require('underscore')

exports.main = async (req, res, next)  => {
const {COD_EMPRESA = '', COD_USUARIO = '' , COD_MONEDA = ''} = req.body
// let COD_MONEDA = req.body.valor ? req.body.valor : ''
let content 	        = [{COD_EMPRESA, COD_USUARIO, COD_MONEDA}];
let in_params  = content.map( item => { return _.keys(item) });  
var valida 		 = [{
    campo			 : 'COD_EMPRESA'          ,
    paquete		 : 'EDS_CCMOVCAJ.'        ,
    funcion		 : 'VALIDAD_CAJA_INTERNAS',
    in_params  : in_params[0]           ,
    out_params : ['NRO_CUENTA','DES_CUENTA','COD_BANCO'],
   }];
  try {
    var response = await validateBooleanFunction(content, valida, req);
    res.status(200).json(response.data);
  } catch (error) {
    log_error.error(`EDS_CCMOVCAJ: VALIDAD_CAJA_INTERNAS : ${error}`);
    console.error('EDS_CCMOVCAJ: VALIDAD_CAJA_INTERNAS   : ',error)
    next()
  }
  
}