const { validateBooleanFunction } = require('../../../../../../utils/validate');
const {log_error}                 = require('../../../../../../utils/logger');
const _                           = require('underscore')

exports.main = async (req, res, next)  => {

	var COD_EMPRESA  			= req.body.cod_empresa;
  var COD_ARTICULO 			= req.body.dependencia[0].COD_ARTICULO
  var COD_UNIDAD_MEDIDA = req.body.valor;

  let content 	 = [{COD_EMPRESA, COD_ARTICULO, COD_UNIDAD_MEDIDA}];
  let in_params  = content.map( item => { return _.keys(item) });  
  
  var valida 		 = [{
			campo			 : 'COD_UNIDAD_MEDIDA'  ,
			paquete		 : 'EDS_VTLISPRE.'   		,
			funcion		 : 'VALIDA_UM'					,
			in_params  : in_params[0]     	 	,
      out_params : ['DESC_UNIDAD_MEDIDA'],
		}];
	try {
		var response = await validateBooleanFunction(content, valida, req);	
		res.status(200).json(response.data);
	} catch (error) {
		log_error.error(`EDS_VTLISPRE: VALIDA_UM : ${error} `);;
		console.error('EDS_VTLISPRE: VALIDA_UM : ',error)
		next()
	}
}