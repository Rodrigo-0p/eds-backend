const { validateBooleanFunction } = require('../../../../../../../utils/validate');
const {log_error}                 = require('../../../../../../../utils/logger');
const _                           = require('underscore')

exports.main = async (req, res, next)  => {
	const { COD_EMPRESA 		= '', TIP_COMPROBANTE = '', IND_AUTORIZAR  = '', IND_RUBRICAR  = '',
          SER_COMPROBANTE = '', NRO_COMPROBANTE = '', COD_CLIENTE 	 = '', COD_USUARIO   = '',
					CLIENTE_OCA			= ''} = req.body
  let content 	 = [{COD_EMPRESA	, TIP_COMPROBANTE, SER_COMPROBANTE, NRO_COMPROBANTE, 
										 COD_CLIENTE  , COD_USUARIO		 , CLIENTE_OCA		,
										 IND_AUTORIZAR, IND_RUBRICAR   ,
										}];
  let in_params  = content.map( item => { return _.keys(item) });  
    var valida 		 = [{
			campo			 : 'COD_EMPRESA'      ,
			paquete		 : 'EDS_CCCANCAJ.'    ,
			funcion		 : 'UP_IND_RUBRICAR'  ,
			in_params  : in_params[0]       ,
      bind_type  : { IND_AUTORIZAR : 'INOUT', 
                     IND_RUBRICAR  : 'INOUT'},
      out_params : ['SALDO','IND_PAGAR'],
		}];
	try {
		var response = await validateBooleanFunction(content, valida, req);	
		res.status(200).json(response.data);
	} catch (error) {
		log_error.error(`EDS_CCCANCAJ: UP_IND_RUBRICAR : ${error} `);;
		console.error('EDS_CCCANCAJ: UP_IND_RUBRICAR : ',error)
		next()
	}
}