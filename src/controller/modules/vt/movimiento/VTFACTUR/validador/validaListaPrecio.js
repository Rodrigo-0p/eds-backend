const { validateBooleanFunction } = require('../../../../../../utils/validate');
const {log_error}                 = require('../../../../../../utils/logger');
const _                           = require('underscore');

exports.main = async (req, res, next)  => {
	const {COD_EMPRESA }	= req.body;
	const COD_LISTA_PRECIO = req.body.valor ? req.body.valor : '';
	let content    = [{COD_EMPRESA, COD_LISTA_PRECIO}];
	let in_params  = content.map( item => { return _.keys(item) });
	var valida 	   = [{
		campo	     : 'COD_LISTA_PRECIO',
		paquete	   : 'EDS_VTFACTUR.',
		funcion	   : 'VALIDA_LISTA_PRECIO',
		in_params  : in_params[0],
		out_params : ['DESC_LISTA_PRECIO'],
	}];
	try {
		var response = await validateBooleanFunction(content, valida, req);	
		res.status(200).json(response.data);
	} catch (error) {
		log_error.error(`EDS_VTFACTUR: VALIDA_LISTA_PRECIOS : ${error} `);
		console.error('EDS_VTFACTUR: VALIDA_LISTA_PRECIOS   : ',error);
		next()
	}
}