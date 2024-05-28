const { validateBooleanFunction } = require('../../../../../../utils/validate');
const {log_error}                 = require('../../../../../../utils/logger');
const _                           = require('underscore');
exports.main = async (req, res, next)  => {
	const { COD_EMPRESA, COD_CLIENTE, COD_SUBCLIENTE, COD_USUARIO } = req.body;
	const COD_VENDEDOR = req.body.valor ? req.body.valor : ''
	let content    = [{COD_EMPRESA, COD_CLIENTE, COD_SUBCLIENTE, COD_USUARIO, COD_VENDEDOR}];
	let in_params  = content.map( item => { return _.keys(item) });
	var valida 	   = [{
		campo	     : 'COD_VENDEDOR',
		paquete	   : 'EDS_VTPEDIDO.',
		funcion	   : 'when_validate_vendedor',
		in_params  : in_params[0],
		out_params : [
			'DESC_VENDEDOR',
			'VENDEDOR_PERSONA',
			'IND_GENERICO',
			'IND_TELEV',
			'COD_SUPERVISOR',
			'SUPERVISOR_PERSONA',
			'COD_LISTA_PRECIO',
			'DESC_LISTA_PRECIO'
		],
	}];
	try {
		var response = await validateBooleanFunction(content, valida, req);	
		res.status(200).json(response.data);
	} catch (error) {
		log_error.error(`EDS_VTPEDIDO: when_validate_vendedor : ${error} `);
		console.error('EDS_VTPEDIDO: when_validate_vendedor   : ',error);
		next();
	}
}