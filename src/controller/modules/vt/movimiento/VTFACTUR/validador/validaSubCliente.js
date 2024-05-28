const { validateBooleanFunction } = require('../../../../../../utils/validate');
const {log_error}                 = require('../../../../../../utils/logger');
const _                           = require('underscore');

exports.main = async (req, res, next)  => {

const {COD_EMPRESA, COD_CLIENTE}	= req.body;
const COD_SUBCLIENTE   = req.body.valor ? req.body.valor : ''

let content    = [{COD_EMPRESA, COD_CLIENTE, COD_SUBCLIENTE}];
let in_params  = content.map( item => { return _.keys(item) });
var valida 	   = [{
	campo	   : 'COD_SUBCLIENTE',
	paquete	   : 'EDS_VTFACTUR.',
	funcion	   : 'VALIDA_SUBCLIENTE',
	in_params  : in_params[0],
	out_params : ['NOM_SUBCLIENTE'],
}];
try {
  var response = await validateBooleanFunction(content, valida, req);	
  res.status(200).json(response.data);
} catch (error) {
  log_error.error(`EDS_VTFACTUR: VALIDA_SUBCLIENTE : ${error} `);
  console.error('EDS_VTFACTUR: VALIDA_SUBCLIENTE   : ',error);
  next()
}
}