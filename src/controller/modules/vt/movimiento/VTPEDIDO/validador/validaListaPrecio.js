const { validateBooleanFunction } = require('../../../../../../utils/validate');
const {log_error}                 = require('../../../../../../utils/logger');
const _                           = require('underscore');
exports.main = async (req, res, next)  => {
	const {COD_EMPRESA, COD_CLIENTE, COD_SUBCLIENTE, COD_VENDEDOR, IND_GENERICO, IND_TELEV }	= req.body;
	const COD_LISTA_PRECIO = req.body.valor ? req.body.valor : '';
	let content    = [{COD_EMPRESA, COD_CLIENTE, COD_SUBCLIENTE, COD_VENDEDOR, IND_GENERICO, IND_TELEV, COD_LISTA_PRECIO}];
	let in_params  = content.map( item => { return _.keys(item) });
	var valida 	   = [{
		campo	     : 'COD_LISTA_PRECIO',
		paquete	   : 'EDS_VTPEDIDO.',
		funcion	   : 'when_validate_lista_precio',
		in_params  : in_params[0],
		out_params : [
			'DESC_LISTA_PRECIO',
			'COD_MONEDA',
			'COD_GRUP_VEND'
		],
	}];
	try {
		var response = await validateBooleanFunction(content, valida, req);	
		res.status(200).json(response.data);
	} catch (error) {
		log_error.error(`EDS_VTPEDIDO: when_validate_lista_precio : ${error} `);
		console.error('EDS_VTPEDIDO: when_validate_lista_precio   : ',error);
		next()
	}
}