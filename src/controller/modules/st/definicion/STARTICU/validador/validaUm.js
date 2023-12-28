const { validateBooleanFunction } = require('../../../../../../utils/validate');
const {log_error}                 = require('../../../../../../utils/logger');
const _                           = require('underscore')

exports.main = async (req, res, next)  => {

	const COD_EMPRESA	   = req.body.cod_empresa;
	const COD_UNIDAD_REL = req.body.valor ? req.body.valor : ''

  let content 	 = [{COD_EMPRESA,COD_UNIDAD_REL}];
  let in_params  = content.map( item => { return _.keys(item) });  
  
  var valida 		 = [{
			campo			 : 'COD_UNIDAD_REL'   ,
			paquete		 : 'EDS_STARTICU.'    ,
			funcion		 : 'VALIDA_UM_MEDIDA' ,
			in_params  : in_params[0]       ,
      out_params : ['REFERENCIA']     ,
		}];
	try {
		var response = await validateBooleanFunction(content, valida, req);	
    res.status(200).json(response.data);
	} catch (error) {
		log_error.error(`EDS_STARTICU: VALIDA_UNIDAD_MEDIDA : ${error} `);;
		console.error('EDS_STARTICU: VALIDA_UNIDAD_MEDIDA   : ',error)
		next()
	}
}