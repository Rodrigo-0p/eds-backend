const { validateBooleanFunction } = require('../../../../../../utils/validate');
const {logger_error}              = require('../../../../../../utils/logger');
const _                           = require('underscore')

exports.main = async (req, res, next)  => {
  const {valor='',COD_MONEDA_US,FEC_COMPROBANTE=''}	 = req.body;

  let content 	= [{COD_MONEDA:valor,COD_MONEDA_US,FEC_COMPROBANTE}];
  let in_params = content.map( item => { return _.keys(item) });  
  var valida  	= [{
		campo			: 'COD_MONEDA',
		paquete		: 'EDS_VTPRESAR.',
		funcion		: 'VALIDA_MONEDA',
		in_params	: in_params[0],
		out_params: ['DESC_MONEDA','DECIMALES','TIP_CAMBIO','TIP_CAMBIO_US'],
    in_type   : {FEC_COMPROBANTE:'DATE'},
    out_type  : {TIP_CAMBIO:'NUMBER',DECIMALES:'NUMBER',TIP_CAMBIO_US:'NUMBER'},
  }];
	try {
		let response = await validateBooleanFunction(content, valida, req);
    res.status(200).json(response.data);		
	} catch (error) {
		logger_error.error(`EDS_VTPRESAR: VALIDA_MONEDA ${error}`);
		console.error('EDS_VTPRESAR: VALIDA_MONEDA',error)
		next();
	}
}