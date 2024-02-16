const { validateProcedure } = require('../../../../../../utils/validate');
const {log_error}           = require('../../../../../../utils/logger');
const _                     = require('underscore')

exports.main = async (req, res, next)  => {
	
  const { COD_MONEDA}   = req.body; 
  let content 	= [{COD_MONEDA}];
  var valida 		= [{
			campo			: 'COD_EMPRESA',
			paquete		: 'EDS_STENVIO',
			funcion		: 'PRE_FORM',
			in_params	: ['COD_MONEDA'],
			out_params: ['TIP_CAMBIO_US'],
	}];
	try {
		var response = await validateProcedure(content, valida, req);
  	res.status(200).json(response.outBinds);
	} catch (error) {
    log_error.error(`STENVIO: GET TIP CAMBIO ${error}`);
		console.error('STENVIO: GET TIP CAMBIO',error)
		next();
	}
}