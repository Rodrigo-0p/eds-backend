const { validateBooleanFunction } = require('../../../../../../utils/validate');
const {log_error}                 = require('../../../../../../utils/logger');
const _                           = require('underscore');
const CalculoActual               = require('./validaCalculoActual');
exports.main = async (req, res, next, band = false )  => {
  let dependencia = _.extend( ...req.body.dependencia);
	let COD_EMPRESA	        = req.body.cod_empresa;
  let COD_ARTICULO	      = dependencia.COD_ARTICULO;
	let IND_VENTA           = dependencia.IND_VENTA;
	let COD_CONDICION_VENTA = dependencia.COD_CONDICION_VENTA;
	let COD_LISTA_PRECIO    = dependencia.COD_LISTA_PRECIO;
	let IND_REG_TURISMO_CAB = 'N';
	let IND_REG_TURISMO_DET = 'N';
	let IND_PORC_VTA_CAB    = 0;
	let IND_PORC_VTA_DET    = 0;
	let DECIMALES           = dependencia.DECIMALES;
	let COD_UNIDAD_MEDIDA   = dependencia.COD_UNIDAD_MEDIDA;
  let CANTIDAD            = req.body.valor ? req.body.valor : '';
  let content 	          = [{ 
		COD_EMPRESA, 
		COD_ARTICULO, 
		IND_VENTA, 
		COD_CONDICION_VENTA, 
		COD_LISTA_PRECIO, 
		IND_REG_TURISMO_CAB, 
		IND_REG_TURISMO_DET,
		IND_PORC_VTA_CAB,
		IND_PORC_VTA_DET,
		DECIMALES,
		COD_UNIDAD_MEDIDA,
		CANTIDAD
	}];  
  let in_params = content.map( item => { return _.keys(item) });
  var valida 	 = [{
    campo	     : 'CANTIDAD',
    paquete	   : 'EDS_VTPEDIDO.',
    funcion	   : 'up_define_precio',			
    in_params  : in_params[0],
    out_params : 	[	
										'PRECIO_VEN'            , 'PRECIO_MI'   , 'PREC_MIN_PERM'   ,
                		'PORC_COMISION'         , 'COD_UM'      , 'PORC_VTA'        ,
										'IND_TIP_PROD'          , 'PORC_NEG'    , 'PRECIO_NEG'      ,
										'FEC_VIGENCIA_PRECIO'   , 'MULT'        , 'DIV'             ,
										'PRECIO_UNITARIO_C_IVA' , 'PRECIO_MIN'  , 'PRECIO_MIN_PERM' ,
										'PRECIO_UB'             , 'PRECIO_LISTA' 
									],
		out_type:{
			PRECIO_VEN: 'NUMBER',
			PRECIO_MI: 'NUMBER',
			PREC_MIN_PERM: 'NUMBER',
			PORC_COMISION: 'NUMBER',
			COD_UM: 'NUMBER',
			PORC_VTA: 'NUMBER',
			PORC_NEG: 'NUMBER',
			PRECIO_NEG: 'NUMBER',
			MULT: 'NUMBER',
			DIV: 'NUMBER',
			PRECIO_UNITARIO_C_IVA: 'NUMBER',
			PRECIO_MIN: 'NUMBER',
			PRECIO_MIN_PERM: 'NUMBER',
			PRECIO_UB: 'NUMBER',
			PRECIO_LISTA: 'NUMBER',
		} 
  }];
  try {
    var response = await validateBooleanFunction(content, valida, req);
		if( response.data.outBinds.ret === 1){ 
			req.body.dependencia = [ ...req.body.dependencia, { PRECIO_UNITARIO_C_IVA: response.data.outBinds.PRECIO_UNITARIO_C_IVA }];
      let outs = await CalculoActual.main( req, res, next, true ); 
			response.data.outBinds = { ...response.data.outBinds, ...outs.outBinds };
    }
    if(band) return response.data; 
    else res.status(200).json(response.data);
  } catch (error) {
    log_error.error(`EDS_VTPEDIDO: up_define_precio : ${error} `);
    console.error('EDS_VTPEDIDO: up_define_precio   : ',error);
    next()
  }
}