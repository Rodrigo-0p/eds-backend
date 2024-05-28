const { validateBooleanFunction } = require('../../../../../../utils/validate');
const {log_error}                 = require('../../../../../../utils/logger');
const _                           = require('underscore')
exports.main = async (req, res, next, band = false )  => {
  let dependencia = _.extend( ...req.body.dependencia);
	let DECIMALES	          = dependencia.DECIMALES;
  let MULT	                  = dependencia.MULT;
	let DIV                   = dependencia.DIV;
	let IND_TIPO              = 'N';
	let IND_VENTA             = 'N';
	let PORC_IVA              = dependencia.PORC_IVA;
	let PORC_GRAVADA          = dependencia.PORC_GRAVADA;
	let PORC_DESC_FIN         = 0;
	let PRECIO_UNITARIO_C_IVA = dependencia.PRECIO_UNITARIO_C_IVA; 
  let CANTIDAD            = req.body.valor ? req.body.valor : '';
  let content 	          = [{ 
		DECIMALES, 
		MULT, 
		DIV, 
		IND_TIPO, 
		IND_VENTA, 
		PORC_IVA, 
		PORC_GRAVADA,
		PORC_DESC_FIN,
		PRECIO_UNITARIO_C_IVA,
		CANTIDAD
	}];  
  let in_params = content.map( item => { return _.keys(item) });
  let valida = [{
    campo	     : 'CANTIDAD',
    paquete	   : 'EDS_VTPEDIDO.',
    funcion	   : 'up_calculo_actual',			
    in_params  : in_params[0],
    out_params : 	[	
										'PORC_DESC_VAR' , 'CANTIDAD_UB'   , 'MONTO_TOTAL_CONIVA' ,
                		'DESCUENTO_VAR' , 'DESCUENTO_FIN' , 'TOTAL_IVA'          ,
										'MONTO_TOTAL'   , 'PRECIO_UB'     , 'PRECIO_UNITARIO'
									],
		out_type:{
			PORC_DESC_VAR: 'NUMBER',
			CANTIDAD_UB: 'NUMBER',
			MONTO_TOTAL_C_IVA: 'NUMBER',
			DESCUENTO_VAR: 'NUMBER',
			DESCUENTO_FIN: 'NUMBER',
			TOTAL_IVA: 'NUMBER',
			MONTO_TOTAL: 'NUMBER',
			PRECIO_UB: 'NUMBER',
			PRECIO_UNITARIO: 'NUMBER',
		} 
  }];
  try {
    var response = await validateBooleanFunction(content, valida, req);
    if(band) return response.data; 
    else res.status(200).json(response.data);
  } catch (error) {
    log_error.error(`EDS_VTPEDIDO: up_calculo_actual : ${error} `);
    console.error('EDS_VTPEDIDO: up_calculo_actual   : ',error);
    next()
  }
}