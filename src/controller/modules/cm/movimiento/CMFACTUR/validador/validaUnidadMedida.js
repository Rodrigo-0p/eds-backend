const { validateBooleanFunction } = require('../../../../../../utils/validate');
const {logger_error}              = require('../../../../../../utils/logger');
const _                           = require('underscore')

exports.main = async (req, res, next)  => {

  let COD_EMPRESA       = req.body.cod_empresa;  
	var COD_SUCURSAL		  = req.body.dependencia[0] ? req.body.dependencia[0].COD_SUCURSAL  : '';
	var COD_MONEDA				= req.body.dependencia[1] ? req.body.dependencia[1].COD_MONEDA    : '';
	var DECIMALES		  		= req.body.dependencia[2] ? req.body.dependencia[2].DECIMALES     : '';
  var COD_ARTICULO		  = req.body.dependencia[3] ? req.body.dependencia[3].COD_ARTICULO  : '';
  let COD_UNIDAD_MEDIDA = req.body.valor;

  let content 	= [{COD_EMPRESA,COD_ARTICULO,COD_UNIDAD_MEDIDA,COD_SUCURSAL,COD_MONEDA,DECIMALES}];
  let in_params = content.map( item => { return _.keys(item) });  
  var valida  	= [{
		campo			: 'COD_EMPRESA',
		paquete		: 'EDS_CMFACTUR.',
		funcion		: 'VALIDA_UM',
		in_params	: in_params[0],
		out_params: [ 'DESC_UNIDAD_MEDIDA'
                , 'MULT'
                , 'DIV'
                , 'IND_BASICO'
                , 'PRECIO_COM'
                , 'PRECIO_COM_UB'
                , 'UNIDAD_MED_COSTO'
                , 'PRECIO_UNITARIO_C_IVA'
                , 'PRECIO_ULTIMO_COSTO'
              ],
    in_type:{
      COD_MONEDA:'NUMBER',
      DECIMALES: 'NUMBER',
    },
    out_type:{
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
		logger_error.error(`EDS_CMFACTUR: VALIDA_UM ${error}`);
		console.error('EDS_CMFACTUR: VALIDA_UM',error)
		next();
	}
}