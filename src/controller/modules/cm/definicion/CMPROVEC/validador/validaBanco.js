const { validateBooleanFunction } = require('../../../../../../utils/validate');
const {log_error}                 = require('../../../../../../utils/logger');
const _                           = require('underscore')

exports.main = async (req, res, next)  => {

	const COD_BANCO = req.body.valor ? req.body.valor : ''

  let content 	 = [{COD_BANCO}];
  let in_params  = content.map( item => { return _.keys(item) });  
  
  var valida 		 = [{
			campo			 : 'COD_BANCO'     ,
			paquete		 : 'EDS_CMPROVEC.' ,
			funcion		 : 'VALIDA_BANCO'  ,
			in_params  : in_params[0]    ,
      out_params : ['DESC_BANCO']  ,
		}];
	try {
		var response = await validateBooleanFunction(content, valida, req);	
    res.status(200).json(response.data);
	} catch (error) {
		log_error.error(`EDS_CMPROVEC: VALIDA_BANCO : ${error} `);
		console.error('EDS_CMPROVEC: VALIDA_BANCO      : ',error)
		next()
	}
}