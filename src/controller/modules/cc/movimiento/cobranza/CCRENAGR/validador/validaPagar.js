const { validateBooleanFunction } = require('../../../../../../../utils/validate');
const {logger_error}              = require('../../../../../../../utils/logger');
const _                           = require('underscore')

exports.main = async (req, res, next)  => {
  const {COD_EMPRESA     = '', COD_USUARIO 		 = '', COD_CLIENTE  	   = '', COD_SUBCLIENTE  = '',
				 TIP_COMPROBANTE = '', SER_COMPROBANTE = '', COD_COBRADOR      = '', NRO_COMPROBANTE = '',
				 TIP_PLANILLA    = '', NRO_PLANILLA    = '', COD_BANCO_CLIENTE = '', NRO_CUOTA			 = '', 
				 TOTA 			     = '', MONTO_A_COBRAR  = '', NRO_CUENTA_CLIENTE= '', COD_MONEDA			 = '',
				 IND_COBRAR			 = ''} = req.body;

	let content 	= [{COD_EMPRESA      , COD_USUARIO		 , COD_CLIENTE		   , COD_SUBCLIENTE		  ,
									  TIP_COMPROBANTE  , SER_COMPROBANTE , NRO_COMPROBANTE   , NRO_CUOTA		  	  ,
									  TIP_PLANILLA	   , NRO_PLANILLA		 , COD_BANCO_CLIENTE , NRO_CUENTA_CLIENTE , 
										COD_MONEDA			 , COD_COBRADOR		 , TOTA						   , MONTO_A_COBRAR			,
										IND_COBRAR			}];

	let in_params = content.map( item => { return _.keys(item) });  
  var valida  	= [{
		campo			: 'COD_EMPRESA',
		paquete		: 'EDS_CCRENAGR.',
		funcion		: 'UP_VALIDA_PAGAR',
		in_params	: in_params[0],
		out_params: [],
    bind_type : {MONTO_A_COBRAR:'INOUT',IND_COBRAR:'INOUT'},
    out_type  : {TOTA:'NUMBER'},    
  }];
	try {
		let response = await validateBooleanFunction(content, valida, req);
		res.status(200).json(response.data);		
	} catch (error) {
		logger_error.error(`EDS_CCRENAGR: UP_VALIDA_PAGAR ${error}`);
		console.error('EDS_CCRENAGR     : UP_VALIDA_PAGAR',error)
		next();
	}
}