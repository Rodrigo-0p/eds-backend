const { validateBooleanFunction } = require('../../../../../../utils/validate');
const {logger_error}              = require('../../../../../../utils/logger');
const _                           = require('underscore')

exports.main = async (req, res, next)  => {

  let COD_EMPRESA   = req.body.cod_empresa;
  let COD_SUCURSAL  = req.body.dependencia[0] ? req.body.dependencia[0].COD_SUCURSAL  : ''
  let COD_MONEDA    = req.body.dependencia[1] ? req.body.dependencia[1].COD_MONEDA    : ''
  let DECIMALES     = req.body.dependencia[2] ? req.body.dependencia[2].DECIMALES     : ''
  let COD_PROVEEDOR = req.body.dependencia[3] ? req.body.dependencia[3].COD_PROVEEDOR : ''
  let COD_ARTICULO  = req.body.valor;

  let content 	= [{COD_EMPRESA,COD_SUCURSAL,COD_ARTICULO,COD_PROVEEDOR,COD_MONEDA,DECIMALES}];
  let in_params = content.map( item => { return _.keys(item) });  
  var valida  	= [{
		campo			: 'COD_EMPRESA',
		paquete		: 'EDS_CMFACTUR.',
		funcion		: 'VALIDA_ARTICULO',
		in_params	: in_params[0],
		out_params: ['DESC_ARTICULO' 				,'IND_MANEJA_EXISTENCIA'  ,'COD_ORIGEN_ART'     , 
                'COD_IVA'								,'PORCENTAJE_IVA'					,'COD_UNIDAD_MEDIDA'  , 
                'DESC_UNIDAD_MEDIDA'		,'NRO_LOTE'								,'FEC_VENCIMIENTO'    , 
                'MISMOPROV'							,'MULT'										,'DIV'                , 
                'IND_BASICO'						,'PRECIO_COM'							,'PRECIO_COM_UB'      , 
                'UNIDAD_MED_COSTO'			,'PRECIO_UNITARIO_C_IVA'	,'PRECIO_ULTIMO_COSTO'],
    in_type:{
      DECIMALES: 'NUMBER',
    },
    out_type:{
      PORCENTAJE_IVA       : 'NUMBER',
      MULT                 : 'NUMBER',
      DIV                  : 'NUMBER',
      PRECIO_COM           : 'NUMBER',
      PRECIO_COM_UB        : 'NUMBER',
      PRECIO_UNITARIO_C_IVA: 'NUMBER',
      PRECIO_ULTIMO_COSTO  : 'NUMBER'
    }
  }];
	try {
		let response = await validateBooleanFunction(content, valida, req);
		res.status(200).json(response.data);		
	} catch (error) {
		logger_error.error(`EDS_CMFACTUR: VALIDA_ARTICULO ${error}`);
		console.error('EDS_CMFACTUR: VALIDA_ARTICULO',error)
		next();
	}
}