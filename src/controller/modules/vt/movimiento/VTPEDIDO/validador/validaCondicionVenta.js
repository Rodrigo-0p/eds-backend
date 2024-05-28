const { validateBooleanFunction } = require('../../../../../../utils/validate');
const {log_error}                 = require('../../../../../../utils/logger');
const _                           = require('underscore');
exports.main = async (req, res, next)  => {
	const {COD_EMPRESA, COD_CLIENTE, TIP_COMPROBANTE_REF, IND_VENTA}	= req.body;
	const COD_CONDICION_VENTA = req.body.valor ? req.body.valor : '';
	let content    = [{COD_EMPRESA, COD_CLIENTE, TIP_COMPROBANTE_REF, IND_VENTA, COD_CONDICION_VENTA}];

	console.log( content );

	let in_params  = content.map( item => { return _.keys(item) });
	var valida 	   = [{
		campo	     : 'COD_CONDICION_VENTA',
		paquete	   : 'EDS_VTPEDIDO.',
		funcion	   : 'when_validate_condicion_venta',
		in_params  : in_params[0],
		out_params : [
			'DESC_CONDICION',
			'LIM_PORC_DESC',
			'DIAS_INICIAL',
			'TIPO',
			// 'BLOQUEAR',
			'IND_TIPO',
			'IND_VTA_ESP',
			'IND_COND_VTA',
			'PORC_DESC_VAR',
			'BLOQUEADO_X_BONIFIC',
			'BLOQUEADO_X_COND'
		],
	}];
	try {
		var response = await validateBooleanFunction(content, valida, req);	
		res.status(200).json(response.data);
	} catch (error) {
		log_error.error(`EDS_VTPEDIDO: when_validate_condicion_venta : ${error} `);
		console.error('EDS_VTPEDIDO: when_validate_condicion_venta   : ',error);
		next()
	}
}