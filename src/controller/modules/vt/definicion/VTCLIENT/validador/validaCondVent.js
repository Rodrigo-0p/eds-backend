const { validateBooleanFunction } = require('../../../../../../utils/validate');
const {log_error}           	    = require('../../../../../../utils/logger');
const _                           = require('underscore')

exports.main = async (req, res, next)  => {

  const COD_EMPRESA         = req.body.COD_EMPRESA
	const COD_CONDICION_VENTA = req.body.valor ? req.body.valor : ''

  let content 	 = [{COD_EMPRESA,COD_CONDICION_VENTA}];
  let in_params  = content.map( item => { return _.keys(item) });  
  
  var valida 		 = [{
			campo			 : 'COD_PERSONA'               ,
			paquete		 : 'EDS_VTCLIENT.'             ,
			funcion		 : 'VALIDA_COD_CONDICION_VENTA',
			in_params  : in_params[0]     ,
      out_params : ['DESC_CONDICION_VENTA'] ,
		}];
	try {
		var response = await validateBooleanFunction(content, valida, req);	
    res.status(200).json(response.data);
	} catch (error) {
		log_error.error(`EDS_VTCLIENT: VALIDA_COD_CONDICION_VENTA : ${error} `);;
		console.error('EDS_VTCLIENT: VALIDA_COD_CONDICION_VENTA   : ',error)
		next()
	}
}