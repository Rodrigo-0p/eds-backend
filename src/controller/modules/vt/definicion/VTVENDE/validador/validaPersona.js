const { validateBooleanFunction } = require('../../../../../../utils/validate');
const {log_error}           	    = require('../../../../../../utils/logger');
const _                           = require('underscore')

exports.main = async (req, res, next)  => {

	const COD_PERSONA = req.body.valor ? req.body.valor : ''

  let content 	 = [{COD_PERSONA}];
  let in_params  = content.map( item => { return _.keys(item) });  
  
  var valida 		 = [{
			campo			 : 'COD_PERSONA'     ,
			paquete		 : 'EDS_VTVENDE.'  ,
			funcion		 : 'VALIDA_PERSONA' ,
			in_params  : in_params[0]     ,
      out_params : ['DESC_PERSONA'] ,
		}];
	try {
		var response = await validateBooleanFunction(content, valida, req);	
    res.status(200).json(response.data);
	} catch (error) {
		log_error.error(`EDS_CMPROVEC: EDS_VTVENDE : ${error} `);;
		console.error('EDS_CMPROVEC: EDS_VTVENDE      : ',error)
		next()
	}
}