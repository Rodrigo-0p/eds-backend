const { validateBooleanFunction } = require('../../../../../../utils/validate');
const {log_error}                 = require('../../../../../../utils/logger');
const _                           = require('underscore')

exports.main = async (req, res, next)  => {
	
  const MODIFICA_DIAS = req.body.MODIFICA_DIAS_ANT
	const CANT_DIA_ANT  = req.body.valor ? req.body.valor : ''

  let content 	 = [{MODIFICA_DIAS,CANT_DIA_ANT}];
  let in_params  = content.map( item => { return _.keys(item) });  
  
  var valida 		 = [{
			campo			 : 'CANT_DIA_ANT'      ,
			paquete		 : 'EDS_CMPROVEC.'     ,
			funcion		 : 'VALIDA_LIMITE_REND',
			in_params  : in_params[0]        ,
      out_params : [] ,
      bind_type  : { CANT_DIA_ANT : 'INOUT' },
		}];
	try {
		var response = await validateBooleanFunction(content, valida, req);	
    res.status(200).json(response.data);
	} catch (error) {
		log_error.error(`EDS_CMPROVEC: MODIFICA_DIAS_ANT : ${error} `);;
		console.error('EDS_CMPROVEC: MODIFICA_DIAS_ANT   : ',error)
		next()
	}
}