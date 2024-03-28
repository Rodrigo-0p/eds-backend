const { validateBooleanFunction } = require('../../../../../../utils/validate');
const {log_error}                 = require('../../../../../../utils/logger');
const _                           = require('underscore')

exports.main = async (req, res, next)  => {

	let {COD_EMPRESA = '',TIP_COMPROBANTE = '', SER_COMPROBANTE = '', NRO_COMPROBANTE = '',IND_COMPRA_LOCAL = 'S'}  = req.body;
	let content 		 = [{COD_EMPRESA,TIP_COMPROBANTE,SER_COMPROBANTE,NRO_COMPROBANTE,IND_COMPRA_LOCAL}];
  let in_params    = content.map( item => { return _.keys(item) });  
  
  var valida 		 = [{
			campo			 : 'COD_GRUPO'       ,
			paquete		 : 'EDS_CMCOFFAC.'   ,
			funcion		 : 'VALIDA_FACTURADO',
			in_params  : in_params[0]      ,
      out_params : []    						 ,
		}];
	try {
		var response = await validateBooleanFunction(content, valida, req);	
    res.status(200).json(response.data.outBinds);
	} catch (error) {
		log_error.error(`EDS_CMCOFFAC: VALIDA_FACTURADO : ${error} `);;
		console.error('EDS_CMCOFFAC: VALIDA_FACTURADO   : ',error)
		next()
	}
}