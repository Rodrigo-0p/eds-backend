const { validateBooleanFunction } = require('../../../../../../utils/validate');
const {log_error}              		= require('../../../../../../utils/logger');
const _                           = require('underscore')

exports.main = async (req, res, next)  => {
	
  const COD_EMPRESA    = req.body.COD_EMPRESA
	const COD_CUENT_CONT = req.body.valor ? req.body.valor : ''

  let content 	 = [{COD_EMPRESA,COD_CUENT_CONT}];
  let in_params  = content.map( item => { return _.keys(item) });  
  
  var valida 		 = [{
			campo			 : 'COD_CUENT_CONT'    ,
			paquete		 : 'EDS_CMPROVEC.'     ,
			funcion		 : 'VALIDA_CUENT_CONT' ,
			in_params  : in_params[0]        ,
      out_params : ['DESC_CUENTA_REF'] ,
		}];
	try {
		var response = await validateBooleanFunction(content, valida, req);	
    res.status(200).json(response.data);
	} catch (error) {
		log_error.error(`EDS_CMPROVEC: VALIDA_CUENT_CONT : ${error} `);;
		console.error('EDS_CMPROVEC: VALIDA_CUENT_CONT      : ',error)
		next()
	}
}