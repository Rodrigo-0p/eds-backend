const { validateBooleanFunction } = require('../../../../../../utils/validate');
const {logger_error}              = require('../../../../../../utils/logger');
const _                           = require('underscore')

exports.main = async (req, res, next)  => {
  const {COD_EMPRESA ='',COD_SUCURSAL=''}	 = req.body;
  const COD_DEPOSITO = req.body.valor ? req.body.valor : ''
	let content 	 = [{COD_EMPRESA,COD_SUCURSAL,COD_DEPOSITO}];
	
	let in_params = content.map( item => { return _.keys(item) });  
  var valida  	= [{
		campo			: 'FEC_COMPROBANTE',
		paquete		: 'EDS_CMFACTUR.'  ,
		funcion		: 'VALIDA_DEPOSITO',
		in_params	: in_params[0]     ,
		out_params: ['DESC_DEPOSITO'], 
  }];
	try {
		let response = await validateBooleanFunction(content, valida, req);
    res.status(200).json(response.data);		
	} catch (error) {
		logger_error.error(`EDS_CMFACTUR: VALIDA_DEPOSITO ${error}`);
		console.error('EDS_CMFACTUR: VALIDA_DEPOSITO',error)
		next();
	}
}