const { validateBooleanFunction } = require('../../../../../../utils/validate');
const {log_error}                 = require('../../../../../../utils/logger');
const _                           = require('underscore')

exports.main = async (req, res, next)  => {

	const COD_PROVEEDOR_REF = req.body.valor ? req.body.valor : ''

  let content 	 = [{COD_PROVEEDOR_REF}];
  let in_params  = content.map( item => { return _.keys(item) });  
  
  var valida 		 = [{
			campo			 : 'COD_PROVEEDOR_REF'     ,
			paquete		 : 'EDS_CMPROVEC.'         ,
			funcion		 : 'VALIDA_PROV_PRINCIPAL' ,
			in_params  : in_params[0]            ,
      out_params : ['DESC_PROVEEDOR_REF']  ,
		}];
	try {
		var response = await validateBooleanFunction(content, valida, req);	
    res.status(200).json(response.data);
	} catch (error) {
		log_error.error(`EDS_CMPROVEC: VALIDA_PROVEEDOR_REF : ${error} `);;
		console.error('EDS_CMPROVEC: VALIDA_PROVEEDOR_REF      : ',error)
		next()
	}
}