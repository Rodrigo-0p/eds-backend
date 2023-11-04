const { validateBooleanFunction } = require('../../../../../../utils/validate');
const {logger_error}              = require('../../../../../../utils/logger');
const _                           = require('underscore')

exports.main = async (req, res, next)  => {

	const {COD_EMPRESA,COD_USUARIO} = req.body

  let content 	 = [{COD_EMPRESA,COD_USUARIO,PARAMETRO:'PERMITE_DIAS_ANT',FORNAME:'CPPROVEE'}];
  let in_params  = content.map( item => { return _.keys(item) });  
  
  var valida 		 = [{
			campo			 : 'COD_EMPRESA'             ,
			paquete		 : 'EDS_CMPROVEC.'           ,
			funcion		 : 'MODIFICA_DIAS_ANT'       ,
			in_params  : in_params[0]              ,
      out_params : ['IND_MODIFICA_DIAS_ANT'] ,
		}];
	try {
		var response = await validateBooleanFunction(content, valida, req);	
    res.status(200).json(response.data);
	} catch (error) {
		logger_error.error(`EDS_CMPROVEC: MODIFICA_DIAS_ANT : ${error} `);;
		console.error('EDS_CMPROVEC: MODIFICA_DIAS_ANT      : ',error)
		next()
	}
}