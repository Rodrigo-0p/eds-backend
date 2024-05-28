const { validateBooleanFunction } = require('../../../../../../../utils/validate');
const {log_error}                 = require('../../../../../../../utils/logger');
const _                           = require('underscore')

exports.main = async (req, res, next)  => {

	let {COD_EMPRESA = '', COD_USUARIO = ''}  = req.body;
  let NRO_CUENTA   = req.body.valor;
	let content 		 = [{COD_EMPRESA,COD_USUARIO,NRO_CUENTA}];

	let in_params    = content.map( item => { return _.keys(item) });  
  
  var valida 		 = [{
			campo			 : 'NRO_CUENTA'   		,
			paquete		 : 'EDS_CCRENAGR.' 		,
			funcion		 : 'VALIDA_NRO_CUENTA',
			in_params  : in_params[0]    		,
      out_params : ['DESC_CUENTA']		,
		}];
	try {
		var response = await validateBooleanFunction(content, valida, req);	
    res.status(200).json(response.data);
	} catch (error) {
		log_error.error(`EDS_CCRENAGR: VALIDA_NRO_CUENTA : ${error}`);
		console.error('EDS_CCRENAGR: VALIDA_NRO_CUENTA   : ',error)
		next()
	}
}