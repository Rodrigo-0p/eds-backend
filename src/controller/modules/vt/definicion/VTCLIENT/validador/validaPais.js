const { validateBooleanFunction } = require('../../../../../../utils/validate');
const {log_error}                 = require('../../../../../../utils/logger');
const _                           = require('underscore')

exports.main = async (req, res, next)  => {
	
	const { valor } = req.body
  let content 	 = [{COD_PAIS:valor}];
  let in_params  = content.map( item => { return _.keys(item) });  

  var valida 		 = [{
			campo			 : 'COD_PAIS'       ,
			paquete		 : 'EDS_VTCLIENT.' 	,
			funcion		 : 'VALIDA_PAIS'		,
			in_params  : in_params[0]     ,
      out_params : ['DESC_PAIS']	  ,
		}];
	try {
		var response = await validateBooleanFunction(content, valida, req);	
		res.status(200).json(response.data);
	} catch (error) {
		log_error.error(`EDS_VTCLIENT: VALIDA_PAIS : ${error} `);;
		console.error('EDS_VTCLIENT: VALIDA_PAIS : ',error)
		next()
	}
}