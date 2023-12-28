const { validateBooleanFunction } = require('../../../../../../utils/validate');
const {log_error}                 = require('../../../../../../utils/logger');
const _                           = require('underscore')

exports.main = async (req, res, next)  => {

	const COD_EMPRESA	 = req.body.COD_EMPRESA;
	const COD_RUBRO    = req.body.valor ? req.body.valor : ''

  let content 	 = [{COD_EMPRESA,COD_RUBRO}];
  let in_params  = content.map( item => { return _.keys(item) });  
  
  var valida 		 = [{
			campo			 : 'COD_RUBRO'      ,
			paquete		 : 'EDS_STARTICU.'  ,
			funcion		 : 'VALIDA_RUBRO'   ,
			in_params  : in_params[0]     ,
      out_params : ['DESC_RUBRO']   ,
		}];
	try {
		var response = await validateBooleanFunction(content, valida, req);	
    res.status(200).json(response.data);
	} catch (error) {
		log_error.error(`EDS_STARTICU: VALIDA_RUBRO : ${error} `);;
		console.error('EDS_STARTICU: VALIDA_RUBRO   : ',error)
		next()
	}
}