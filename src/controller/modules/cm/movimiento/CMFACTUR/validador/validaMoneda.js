const { validateBooleanFunction } = require('../../../../../../utils/validate');
const {logger_error}              = require('../../../../../../utils/logger');
const _                           = require('underscore')

exports.main = async (req, res, next)  => {
  const {COD_MONEDA='',COD_MONEDA_BASE='',COD_MONEDA_DOL='',COD_MONEDA_REAL='',TIP_CAMBIO='',FEC_COMPROBANTE=''}	 = req.body;
  let content 	= [{COD_MONEDA,COD_MONEDA_BASE,COD_MONEDA_DOL,COD_MONEDA_REAL,TIPO_CAMBIO:TIP_CAMBIO,FEC_COMPROBANTE}];
  let in_params = content.map( item => { return _.keys(item) });  
  var valida  	= [{
		campo			: 'COD_MONEDA',
		paquete		: 'EDS_CMFACTUR.',
		funcion		: 'VALIDA_MONEDA',
		in_params	: in_params[0],
		out_params: ['DESC_MONEDA','DECIMALES','TIP_CAMBIO','TIP_CAMBIO_US','TIP_CAMBIO_RS'],
    in_type   : {FEC_COMPROBANTE:'DATE'},
    out_type  : {TIP_CAMBIO:'NUMBER',DECIMALES:'NUMBER',TIP_CAMBIO_US:'NUMBER',TIP_CAMBIO_RS:'NUMBER'},
  }];
	try {
		let response = await validateBooleanFunction(content, valida, req);
    res.status(200).json(response.data);		
	} catch (error) {
		logger_error.error(`EDS_CMFACTUR: VALIDA_MONEDA ${error}`);
		console.error('EDS_CMFACTUR: VALIDA_MONEDA',error)
		next();
	}
}