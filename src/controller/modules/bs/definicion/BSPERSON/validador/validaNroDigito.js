const { validateBooleanFunction } = require('../../../../../../utils/validate');
const {log_error}                 = require('../../../../../../utils/logger');
const _                           = require('underscore')

exports.main = async (req, res, next)  => {
	const { COD_IDENT,NRO_DOCUMENTO, valor  } = req.body

  let content 	 = [{COD_IDENT,NRO_DOCUMENTO, NRO_DIG_VER:valor}];
  let in_params  = content.map( item => { return _.keys(item) });  
  
  var valida 		 = [{
			campo			 : 'NRO_DIG_VER'         ,
			paquete		 : 'EDS_BSPERSON.'       ,
			funcion		 : 'VALIDA_DIGINTO_VERIFICADOR',
			in_params  : in_params[0]          ,
      in_type    : { NRO_DIG_VER : 'NUMBER'},
      bind_type  : { NRO_DIG_VER : 'INOUT' },
      out_params : [],
		}];
	try {
		var response = await validateBooleanFunction(content, valida, req);	
    res.status(200).json(response.data);
	} catch (error) {
		log_error.error(`EDS_BSPERSON: VALIDA_DIGINTO_VERIFICADOR : ${error} `);;
		console.error('EDS_BSPERSON: VALIDA_DIGINTO_VERIFICADOR : ',error)
		next()
	}
}