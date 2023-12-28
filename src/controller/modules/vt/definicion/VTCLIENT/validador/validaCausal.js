const { validateBooleanFunction } = require('../../../../../../utils/validate');
const {log_error}           	    = require('../../../../../../utils/logger');
const _                           = require('underscore')

exports.main = async (req, res, next)  => {

  const {BLOQUEAR_CLIENTE = ''} = req.body
	const COD_CAUSAL              = req.body.valor ? req.body.valor : ''

  let content 	 = [{COD_CAUSAL,BLOQUEAR_CLIENTE}];
  let in_params  = content.map( item => { return _.keys(item) });  
  
  var valida 		 = [{
			campo			 : 'COD_PERSONA'    ,
			paquete		 : 'EDS_VTCLIENT.'  ,
			funcion		 : 'VALIDA_CAUSAL'  ,
			in_params  : in_params[0]     ,
      out_params : ['DESC_CAUSAL']  ,
		}];
	try {
		var response = await validateBooleanFunction(content, valida, req);	
    res.status(200).json(response.data);
	} catch (error) {
		log_error.error(`EDS_VTCLIENT: VALIDA_CAUSAL : ${error} `);;
		console.error('EDS_VTCLIENT: VALIDA_CAUSAL   : ',error)
		next()
	}
}