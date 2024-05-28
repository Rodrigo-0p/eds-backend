const { validateBooleanFunction } = require('../../../../../../utils/validate');
const {log_error}                 = require('../../../../../../utils/logger');
const _                           = require('underscore');
const moment                      = require('moment');
exports.main = async (req, res, next)  => {
	let FEC_COMPROBANTE =  moment(req.body.FEC_COMPROBANTE.slice(0,10)).format('DD/MM/YYYY');
	FEC_COMPROBANTE = null;
	const COD_MONEDA = req.body.valor ? req.body.valor : '';
	let content    = [{FEC_COMPROBANTE, COD_MONEDA}]; 
	let in_params  = content.map( item => { return _.keys(item) });
	var valida 	   = [{
		campo	     : 'COD_MONEDA',
		paquete	   : 'EDS_VTPEDIDO.',
		funcion	   : 'when_validate_moneda',
		in_params  : in_params[0],
		out_params : ['DESC_MONEDA','DECIMALES','TIP_CAMBIO'],
		out_type   : {
			FEC_COMPROBANTE: 'DATE'
		}
	}];
	try {
		var response = await validateBooleanFunction(content, valida, req);
		res.status(200).json(response.data);
	} catch (error) {
		log_error.error(`EDS_VTPEDIDO: when_validate_moneda : ${error} `);
		console.error('EDS_VTPEDIDO: when_validate_moneda   : ',error);
		next()
	}
}