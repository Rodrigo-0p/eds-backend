const { validateBooleanFunction } = require('../../../../../../utils/validate');
const {log_error}           	    = require('../../../../../../utils/logger');
const _                           = require('underscore')

exports.main = async (req, res, next)  => {

  const COD_EMPRESA     = req.body.COD_EMPRESA
  const COD_PERSONA_ANT = req.body.COD_PERSONA_ANT
	const COD_PERSONA     = req.body.valor ? req.body.valor : ''
  let content 	 				= [{COD_EMPRESA,COD_PERSONA,COD_PERSONA_ANT}];
  let in_params  				= content.map( item => { return _.keys(item) });  
  
  var valida 		 = [{
			campo			 : 'COD_PERSONA'              ,
			paquete		 : 'EDS_VTCLIENT.'            ,
			funcion		 : 'VALIDA_PERSONA'           ,
			in_params  : in_params[0]     ,
      out_params : ['NOMBRE','NOMB_FANTASIA','PAIS','PROVINCIA','CIUDAD','DIRECCION_CAB','NRO_DOCUMENTO','NRO_DIG_VER','TELEFONO'] ,
		}];
	try {
		var response = await validateBooleanFunction(content, valida, req);	
    res.status(200).json(response.data);
	} catch (error) {
		log_error.error(`EDS_VTCLIENT: VALIDA_PERSONA : ${error} `);;
		console.error('EDS_VTCLIENT: VALIDA_PERSONA      : ',error)
		next()
	}
}