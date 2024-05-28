const { validateBooleanFunction } = require('../../../../../../utils/validate');
const {logger_error}              = require('../../../../../../utils/logger');
const _                           = require('underscore')

exports.main = async (req, res, next)  => {

  let dependencia       =  _.extend( ...req.body.dependencia );
  let COD_EMPRESA       = req.body.cod_empresa;
  let COD_UNIDAD_MEDIDA = req.body.valor;

  let COD_ARTICULO          = dependencia.COD_ARTICULO          ? dependencia.COD_ARTICULO           : ''
  let DECIMALES             = dependencia.DECIMALES             ? dependencia.DECIMALES              : 1
  let CANTIDAD              = dependencia.CANTIDAD              ? dependencia.CANTIDAD               : ''
  let DESCUENTO             = dependencia.DESCUENTO             ? dependencia.DESCUENTO              : ''
  let COD_LISTA_PRECIO      = dependencia.COD_LISTA_PRECIO      ? dependencia.COD_LISTA_PRECIO       : ''
  let COD_SUCURSAL          = dependencia.COD_SUCURSAL          ? dependencia.COD_SUCURSAL           : ''
    
  let content 	= [{COD_EMPRESA,COD_SUCURSAL,COD_ARTICULO,COD_UNIDAD_MEDIDA,DECIMALES,CANTIDAD,DESCUENTO,COD_LISTA_PRECIO}];

  let in_params = content.map( item => { return _.keys(item) });  
  var valida  	= [{
		campo			: 'COD_EMPRESA',
		paquete		: 'EDS_VTPRESAR.',
		funcion		: 'VALIDA_UM',
		in_params	: in_params[0],
		out_params: ['PRECIO_UNITARIO_C_IVA','DESC_UNIDAD_MEDIDA','MULT','DIV','PORC_DESC','CANTIDAD_UB','MONTO_TOTAL'],
    in_type   : {CANTIDAD : 'NUMBER' , DESCUENTO: 'NUMBER', MONTO_TOTAL_C_IVA  : 'NUMBER'},
    out_type:{
      PRECIO_UNITARIO_C_IVA : 'NUMBER',
      MULT        : 'NUMBER',
      DIV         : 'NUMBER',
      PORC_DESC   : 'NUMBER',
      CANTIDAD_UB : 'NUMBER',
      MONTO_TOTAL : 'NUMBER',
    },    
  }];
 

	try {
		let response = await validateBooleanFunction(content, valida, req);
		res.status(200).json(response.data);
	} catch (error) {
		logger_error.error(`EDS_VTPRESAR: VALIDA_UM ${error}`);
		console.error('EDS_VTPRESAR: VALIDA_UM',error)
		next();
	}
}