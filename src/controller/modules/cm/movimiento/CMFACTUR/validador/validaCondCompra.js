const { validateBooleanFunction } = require('../../../../../../utils/validate');
const {logger_error}              = require('../../../../../../utils/logger');
const _                           = require('underscore')

exports.main = async (req, res, next)  => {
  const {COD_EMPRESA,COD_CONDICION_COMPRA = '',COD_CONDICION_COMPRA_ANT = ''}	 = req.body;
  let content 	= [{COD_EMPRESA,COD_CONDICION_COMPRA,COD_CONDICION_COMPRA_ANT}];
  let in_params = content.map( item => { return _.keys(item) });  
  var valida  	= [{
		campo			: 'COD_CONDICION_COMPRA',
		paquete		: 'EDS_CMFACTUR.',
		funcion		: 'VALIDA_CONDICION_COMPRA',
		in_params	: in_params[0],
		out_params: ['DESC_CONDICION','PLAZO','BLOQ_X_COND'],
  }];
	try {
		let response = await validateBooleanFunction(content, valida, req);
		res.status(200).json(response.data);		
	} catch (error) {
		logger_error.error(`EDS_CMFACTUR: VALIDA_CONDICION_COMPRA ${error}`);
		console.error('EDS_CMFACTUR: VALIDA_CONDICION_COMPRA',error)
		next();
	}
}