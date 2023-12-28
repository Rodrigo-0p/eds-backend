const { validateBooleanFunction } = require('../../../../../../utils/validate');
const {log_error}           	    = require('../../../../../../utils/logger');
const _                           = require('underscore')

exports.main = async (req, res, next)  => {

  const LIMITE_CREDITO    = req.body.LIMIT_CREDITO
	const COD_MONEDA_LIMITE = req.body.valor ? req.body.valor : ''
  let content 	 = [{COD_MONEDA_LIMITE,LIMITE_CREDITO}];
  let in_params  = content.map( item => { return _.keys(item) });  
  
  var valida 		 = [{
			campo			 : 'COD_MONEDA_LIMITE'     		 ,
			paquete		 : 'EDS_VTCLIENT.'         		 ,
			funcion		 : 'VALIDA_MONEDA_LIMITE'  		 ,
			in_params  : in_params[0]            		 ,
      out_params : ['DESC_MONEDA_LIMITE']  		 ,
			in_type    : { LIMITE_CREDITO : 'NUMBER'},
		}];
	try {
		var response = await validateBooleanFunction(content, valida, req);	
    res.status(200).json(response.data);
	} catch (error) {
		log_error.error(`EDS_VTCLIENT: VALIDA_MONEDA : ${error} `);;
		console.error('EDS_VTCLIENT: VALIDA_MONEDA   : ',error)
		next()
	}
}