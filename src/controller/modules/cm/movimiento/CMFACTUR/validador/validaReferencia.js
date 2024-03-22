const { validateBooleanFunction } = require('../../../../../../utils/validate');
const {logger_error}              = require('../../../../../../utils/logger');
const _                           = require('underscore')

exports.main = async (req, res, next)  => {
  const {COD_EMPRESA,IND_AUTO_IMPRESO,COD_PROVEEDOR,NRO_TIMBRADO,IND_TIMBRADO} = req.body;  
  let REFERENCIA     = req.body.valor
  let content 		   = [{COD_EMPRESA,REFERENCIA,IND_AUTO_IMPRESO,COD_PROVEEDOR,NRO_TIMBRADO,IND_TIMBRADO}];

  let in_params = content.map( item => { return _.keys(item) });  
  var valida  	= [{
		campo			: 'COD_EMPRESA',
		paquete		: 'EDS_CMFACTUR.',
		funcion		: 'UP_VALIDA_TIMBRADO_NUMERACION',
		in_params	: in_params[0],
		out_params: []
  }];
	try {
		var response = await validateBooleanFunction(content, valida, req);
		res.status(200).json(response.data);		
	} catch (error) {
		logger_error.error(`EDS_CMFACTUR: UP_VALIDA_TIMBRADO_NUMERACION ${error}`);
		console.error('EDS_CMFACTUR: UP_VALIDA_TIMBRADO_NUMERACION',error)
		next();
	}
}