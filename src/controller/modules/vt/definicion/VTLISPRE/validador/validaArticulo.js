const { validateBooleanFunction } = require('../../../../../../utils/validate');
const {log_error}                 = require('../../../../../../utils/logger');
const _                           = require('underscore')

exports.main = async (req, res, next)  => {

	const COD_EMPRESA  = req.body?.cod_empresa
  const COD_ARTICULO = req.body.valor;

  let content 	 = [{COD_EMPRESA, COD_ARTICULO}];
  let in_params  = content.map( item => { return _.keys(item) });  
  
  var valida 		 = [{
			campo			 : 'COD_EMPRESA'    ,
			paquete		 : 'EDS_VTLISPRE.'  ,
			funcion		 : 'VALIDA_ARTICULO',
			in_params  : in_params[0]     ,
      out_params : ['DESC_ARTICULO'],
		}];
	try {
		var response = await validateBooleanFunction(content, valida, req);	
		res.status(200).json(response.data);
	} catch (error) {
		log_error.error(`EDS_VTLISPRE: VALIDA_ARTICULO : ${error} `);;
		console.error('EDS_VTLISPRE: VALIDA_ARTICULO : ',error)
		next()
	}
}