const { validateBooleanFunction } = require('../../../../../../utils/validate');
const {log_error}                 = require('../../../../../../utils/logger');
const _                           = require('underscore')

exports.main = async (req, res, next)  => {
	const { COD_PERSONA,COD_IDENT, valor  } = req.body

  let content 	 = [{COD_PERSONA, COD_IDENT, NRO_DOCUMENTO:valor}];
  let in_params  = content.map( item => { return _.keys(item) });  
  
  var valida 		 = [{
			campo			 : 'NRO_DOCUMENTO'       ,
			paquete		 : 'EDS_BSPERSON.'       ,
			funcion		 : 'VALIDA_NRO_DOCUMENTO',
			in_params  : in_params[0]          ,
      in_type    : { NRO_DOCUMENTO : 'NUMBER'},
      bind_type  : { NRO_DOCUMENTO : 'INOUT' },
      out_params : ['NRO_DIG_VER'],
		}];
	try {
		var response = await validateBooleanFunction(content, valida, req);	
		res.status(200).json(response.data);
	} catch (error) {
		log_error.error(`EDS_BSPERSON: VALIDA_NRO_DOCUMENTO : ${error} `);;
		console.error('EDS_BSPERSON: VALIDA_NRO_DOCUMENTO : ',error)
		next()
	}
}