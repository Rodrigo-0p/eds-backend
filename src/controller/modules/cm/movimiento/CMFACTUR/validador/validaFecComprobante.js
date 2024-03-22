const { validateBooleanFunction } = require('../../../../../../utils/validate');
const {logger_error}              = require('../../../../../../utils/logger');
const _                           = require('underscore')

exports.main = async (req, res, next)  => {
  const FEC_COMPROBANTE	 = req.body.valor;
	let content 	         = [{FEC_COMPROBANTE: FEC_COMPROBANTE ? FEC_COMPROBANTE : null}];
	
	let in_params = content.map( item => { return _.keys(item) });  
  var valida  	= [{
		campo			: 'FEC_COMPROBANTE',
		paquete		: 'EDS_CMFACTUR.',
		funcion		: 'VALIDA_FECHA_COMPROBANTE',
		in_params	: in_params[0],
		out_params: [],    
    bind_type : {'FEC_COMPROBANTE':'INOUT'},
    out_type  : {FEC_COMPROBANTE:'SYSDATE'},    
  }];
	try {
		let response = await validateBooleanFunction(content, valida, req);
		res.status(200).json(response.data);		
	} catch (error) {
		logger_error.error(`EDS_CMFACTUR: VALIDA_FECHA_COMPROBANTE ${error}`);
		console.error('EDS_CMFACTUR: VALIDA_FECHA_COMPROBANTE',error)
		next();
	}
}