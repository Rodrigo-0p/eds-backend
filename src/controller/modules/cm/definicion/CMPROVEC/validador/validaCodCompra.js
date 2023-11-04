const { validateBooleanFunction } = require('../../../../../../utils/validate');
const {log_error}                 = require('../../../../../../utils/logger');
const _                           = require('underscore')

exports.main = async (req, res, next)  => {
	
  const COD_EMPRESA = req.body.COD_EMPRESA
	const COD_COMPRA  = req.body.valor ? req.body.valor : ''

  let content 	 = [{COD_EMPRESA,COD_COMPRA}];
  let in_params  = content.map( item => { return _.keys(item) });  
  
  var valida 		 = [{
			campo			 : 'COD_COMPRA'          ,
			paquete		 : 'EDS_CMPROVEC.'           ,
			funcion		 : 'VALIDA_CONDICION_COMPRA' ,
			in_params  : in_params[0]        ,
      out_params : ['DESC_CONDICION_COMPRA'] ,
		}];
	try {
		var response = await validateBooleanFunction(content, valida, req);	
    res.status(200).json(response.data);
	} catch (error) {
		log_error.error(`EDS_CMPROVEC: VALIDA_CONDICION_COMPRA : ${error} `);;
		console.error('EDS_CMPROVEC: VALIDA_CONDICION_COMPRA      : ',error)
		next()
	}
}