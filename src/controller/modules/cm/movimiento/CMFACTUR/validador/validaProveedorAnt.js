const { validateBooleanFunction } = require('../../../../../../utils/validate');
const {logger_error}              = require('../../../../../../utils/logger');
const _                           = require('underscore')

exports.main = async (req, res, next)  => {
  const {COD_EMPRESA}	 = req.body;
  const COD_PROVEEDOR  = req.body.valor ? req.body.valor : ''
  let content 	       = [{COD_EMPRESA,COD_PROVEEDOR}];
  let in_params = content.map( item => { return _.keys(item) });  
  var valida  	= [{
		campo			: 'COD_PROVEEDOR',
		paquete		: 'EDS_CMFACTUR.',
		funcion		: 'VALIDA_PROVEEDOR_ANT',
		in_params	: in_params[0],
		out_params: [ 'DESC_PROVEEDOR_ANT']}];
	try {
		var response = await validateBooleanFunction(content, valida, req);
		res.status(200).json(response.data);		
	} catch (error) {
		logger_error.error(`EDS_CMFACTUR: valida_proveedor_ant ${error}`);
		console.error('EDS_CMFACTUR: valida_proveedor_ant',error)
		next();
	}
}