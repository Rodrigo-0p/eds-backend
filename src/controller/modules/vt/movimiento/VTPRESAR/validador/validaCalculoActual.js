const { validateBooleanFunction } = require('../../../../../../utils/validate');
const {logger_error}              = require('../../../../../../utils/logger');
const _                           = require('underscore')

exports.main = async (req, res, next)  => {
  const {PRECIO_UNITARIO_C_IVA = '', DECIMALES = '', MULT = '', DIV = '', PORC_IVA= '', PORC_GRAVADA = '', CANTIDAD = '',DESCUENTO = ''} = req.body
  let content 	= [{DECIMALES,MULT,DIV,PORC_IVA,PORC_GRAVADA,PRECIO_UNITARIO_C_IVA,CANTIDAD,DESCUENTO}];
  let in_params = content.map( item => { return _.keys(item) });  
  var valida  	= [{
		campo			: 'CANTIDAD',
		paquete		: 'EDS_VTPRESAR.',
		funcion		: 'UP_CALCULO_ACTUAL',
		in_params	: in_params[0],
		out_params: ['CANTIDAD_UB'
                ,'MONTO_TOTAL_CONIVA'
                ,'TOTAL_IVA'
                ,'MONTO_TOTAL'
                ,'PRECIO_UNITARIO'],
    in_type   : { DECIMALES              :'NUMBER' 
                , MULT                   :'NUMBER'
                , DIV                    :'NUMBER'
                , PORC_IVA               :'NUMBER'
                , PORC_GRAVADA           :'NUMBER'
                , PRECIO_UNITARIO_C_IVA  :'NUMBER'
                , CANTIDAD               :'NUMBER'
                , DESCUENTO              :'NUMBER'
              },
    out_type:{
      CANTIDAD_UB         : 'NUMBER',
      MONTO_TOTAL_CONIVA  : 'NUMBER',
      TOTAL_IVA           : 'NUMBER',
      MONTO_TOTAL         : 'NUMBER',
      PRECIO_UNITARIO     : 'NUMBER',
    },    
  }];
	try {
		let response = await validateBooleanFunction(content, valida, req);
		res.status(200).json(response.data);
	} catch (error) {
		logger_error.error(`EDS_VTPRESAR: UP_CALCULO_ACTUAL ${error}`);
		console.error('EDS_VTPRESAR: UP_CALCULO_ACTUAL',error)
		next();
	}
}