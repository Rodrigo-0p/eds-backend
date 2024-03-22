const { validateBooleanFunction } = require('../../../../../../utils/validate');
const {logger_error}              = require('../../../../../../utils/logger');
const _                           = require('underscore')

exports.main = async (req, res, next)  => {

  let COD_EMPRESA       = req.body.cod_empresa;  
	let REC_PROVEEDOR	    = req.body.dependencia[0] ? req.body.dependencia[0].REC_PROVEEDOR : '';
  let COD_ARTICULO	    = req.body.dependencia[1] ? req.body.dependencia[1].COD_ARTICULO  : '';
	let MISMOPROV	  	    = req.body.dependencia[2] ? req.body.dependencia[2].MISMOPROV     : '';
  let COD_PROVEEDOR_REC = req.body.valor;

  let content 	= [{COD_EMPRESA,COD_ARTICULO,COD_PROVEEDOR_REC,REC_PROVEEDOR,MISMOPROV}];
  let in_params = content.map( item => { return _.keys(item) });  
  var valida  	= [{
		campo			: 'COD_EMPRESA',
		paquete		: 'EDS_CMFACTUR.',
		funcion		: 'VALIDA_COD_PROVEEDOR_REC',
		in_params	: in_params[0],
		out_params: ['DESC_PROVEEDOR_REC'],
  }];
	try {
		let response = await validateBooleanFunction(content, valida, req);
		res.status(200).json(response.data);		
	} catch (error) {
		logger_error.error(`EDS_CMFACTUR: VALIDA_COD_PROVEEDOR_REC ${error}`);
		console.error('EDS_CMFACTUR: VALIDA_COD_PROVEEDOR_REC',error)
		next();
	}
}