const { validateBooleanFunction } = require('../../../../../../utils/validate');
const {log_error}                 = require('../../../../../../utils/logger');
const _                           = require('underscore')

exports.main = async (req, res, next)  => {

	const COD_EMPRESA		= req.body.COD_EMPRESA;
	const COD_PROVEEDOR_DFLT = req.body.valor ? req.body.valor : ''
	
  let content 	 = [{COD_EMPRESA,COD_PROVEEDOR_DFLT}];
  let in_params  = content.map( item => { return _.keys(item) });  
  
  var valida 		 = [{
			campo			 : 'COD_PROVEEDOR_DFLT'     ,
			paquete		 : 'EDS_STARTICU.'     ,
			funcion		 : 'VALIDA_PROVEEDOR'  ,
			in_params  : in_params[0]        ,
      out_params : ['DESC_PROVEEDOR']  ,
		}];
	try {
		var response = await validateBooleanFunction(content, valida, req);	
    res.status(200).json(response.data);
	} catch (error) {
		log_error.error(`EDS_STARTICU: VALIDA_PROVEEDOR : ${error} `);;
		console.error('EDS_STARTICU: VALIDA_PROVEEDOR      : ',error)
		next()
	}
}