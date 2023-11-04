const { validateBooleanFunction } = require('../../../../../../utils/validate');
const {log_error}                 = require('../../../../../../utils/logger');
const _                           = require('underscore')

exports.main = async (req, res, next)  => {
	const { COD_PAIS,COD_PROVINCIA, COD_CIUDAD, valor  } = req.body
  let content 	 = [{COD_PAIS, COD_PROVINCIA, COD_CIUDAD, COD_BARRIO:valor}];
  let in_params  = content.map( item => { return _.keys(item) });  
  
  var valida 		 = [{
			campo			 : 'COD_BARRIO'    ,
			paquete		 : 'EDS_BSPERSON.' ,
			funcion		 : 'VALIDA_BARRIO',
			in_params  : in_params[0]    ,
      out_params : ['DESC_BARRIO'] ,
		}];
	try {
		var response = await validateBooleanFunction(content, valida, req);	
    res.status(200).json(response.data);
	} catch (error) {
		log_error.error(`EDS_BSPERSON: VALIDA_BARRIO : ${error} `);;
		console.error('EDS_BSPERSON: VALIDA_BARRIO      : ',error)
		next()
	}
}