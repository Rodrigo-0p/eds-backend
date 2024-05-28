const { validateBooleanFunction } = require('../../../../../../utils/validate');
const {log_error}           	    = require('../../../../../../utils/logger');
const _                           = require('underscore')

exports.main = async (req, res, next)  => {

  const {COD_EMPRESA = ''} = req.body
	const COD_VENDEDOR       = req.body.valor ? req.body.valor : ''
  
  let content 	 = [{COD_EMPRESA,COD_VENDEDOR}];
  let in_params  = content.map( item => { return _.keys(item) });  
  
  var valida 		 = [{
			campo			 : 'COD_PERSONA'    ,
			paquete		 : 'EDS_VTPRESAR.'  ,
			funcion		 : 'VALIDA_VENDEDOR'  ,
			in_params  : in_params[0]     ,
      out_params : ['DESC_VENDEDOR']  ,
		}];
	try {
		var response = await validateBooleanFunction(content, valida, req);	
    res.status(200).json(response.data);
	} catch (error) {
		log_error.error(`EDS_VTPRESAR: VALIDA_VENDEDOR : ${error} `);;
		console.error('EDS_VTPRESAR: VALIDA_VENDEDOR   : ',error)
		next()
	}
}