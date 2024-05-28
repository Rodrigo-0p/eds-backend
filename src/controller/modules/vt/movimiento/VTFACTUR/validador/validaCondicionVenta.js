const { validateBooleanFunction } = require('../../../../../../utils/validate');
const {log_error}                 = require('../../../../../../utils/logger');
const _                           = require('underscore');
exports.main = async (req, res, next)  => {
	const {COD_EMPRESA, COD_CLIENTE, TIP_COMPROBANTE_REF}	= req.body;
	const COD_CONDICION_VENTA = req.body.valor ? req.body.valor : '';
	let content    = [{COD_EMPRESA, COD_CLIENTE, TIP_COMPROBANTE_REF, COD_CONDICION_VENTA}];
	let in_params  = content.map( item => { return _.keys(item) });
	var valida 	   = [{
		campo	     : 'COD_CONDICION_VENTA',
		paquete	   : 'EDS_VTFACTUR.',
		funcion	   : 'VALIDA_COND_VENTAS',
		in_params  : in_params[0],
		out_params : ['DESC_CONDICION_VENTA','LIM_PORC_DESC','DIAS_INICIAL','TIPO','BLOQUEAR','IND_TIPO','IND_VTA_ESP','IND_COND_VTA'],
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