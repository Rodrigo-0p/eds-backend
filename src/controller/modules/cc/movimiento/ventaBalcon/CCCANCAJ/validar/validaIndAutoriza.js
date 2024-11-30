const { validateBooleanFunction } = require('../../../../../../../utils/validate');
const {log_error}                 = require('../../../../../../../utils/logger');
const _                           = require('underscore')

exports.main = async (req, res, next)  => {
	const { COD_EMPRESA 		= '', TIP_COMPROBANTE = '',IND_BLOQUEADO 	 ='', 
					COBRAR_EFE      = '', IND_AUTORIZAR 	= '',SER_COMPROBANTE ='',
					NRO_COMPROBANTE = '', COD_CLIENTE 		= '',COD_USUARIO     =''} = req.body

  let content 	 = [{COD_EMPRESA	, TIP_COMPROBANTE, SER_COMPROBANTE, NRO_COMPROBANTE, 
										 IND_BLOQUEADO, COBRAR_EFE		 , COD_CLIENTE		, COD_USUARIO		 ,
										 IND_AUTORIZAR,
										}];
										
  let in_params  = content.map( item => { return _.keys(item) });  
    var valida 		 = [{
			campo			 : 'TIP_COMPROBANTE'    ,
			paquete		 : 'EDS_CCCANCAJ.'      ,
			funcion		 : 'UP_IND_AUTORIZAR'   ,
			in_params  : in_params[0]         ,
      bind_type  : { IND_AUTORIZAR : 'INOUT' },
      out_params : ['SALDO'],
		}];
	try {
		var response = await validateBooleanFunction(content, valida, req);	
		res.status(200).json(response.data);
	} catch (error) {
		log_error.error(`EDS_CCCANCAJ: UP_IND_AUTORIZAR : ${error} `);;
		console.error('EDS_CCCANCAJ: UP_IND_AUTORIZAR : ',error)
		next()
	}
}