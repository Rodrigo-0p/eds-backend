const { validateBooleanFunction } = require('../../../../../../utils/validate');
const {logger_error}              = require('../../../../../../utils/logger');
const _                           = require('underscore')

exports.main = async (req, res, next)  => {

  let dependencia      =  _.extend( ...req.body.dependencia );
  let COD_EMPRESA      = req.body.cod_empresa;
  let COD_ARTICULO     = req.body.valor;
  let COD_SUCURSAL     = dependencia.COD_SUCURSAL     ? dependencia.COD_SUCURSAL      : ''
  let COD_LISTA_PRECIO = dependencia.COD_LISTA_PRECIO ? dependencia.COD_LISTA_PRECIO  : ''
  
  let content 	= [{COD_EMPRESA,COD_SUCURSAL,COD_LISTA_PRECIO,COD_ARTICULO}];
  let in_params = content.map( item => { return _.keys(item) });  
  var valida  	= [{
		campo			: 'COD_EMPRESA',
		paquete		: 'EDS_VTPRESAR.',
		funcion		: 'VALIDA_ARTICULO',
		in_params	: in_params[0],
		out_params: ['DESC_ARTICULO' 	     ,'COD_UNIDAD_MEDIDA','DESC_UNIDAD_MEDIDA' ,
                'PRECIO_UNITARIO_C_IVA','PRECIO_UNITARIO_C_IVA_ANT'              ,
                'FEC_VENCIMIENTO'      , 'MULT'	,'DIV'
              ],
    in_type:{},
    out_type:{
      MULT                     : 'NUMBER',
      DIV                      : 'NUMBER',
      PRECIO_UNITARIO_C_IVA    : 'NUMBER',
      PRECIO_UNITARIO_C_IVA_ANT: 'NUMBER',
    }
  }];
	try {
		let response = await validateBooleanFunction(content, valida, req);
		res.status(200).json(response.data);		
	} catch (error) {
		logger_error.error(`EDS_VTPRESAR: VALIDA_ARTICULO ${error}`);
		console.error('EDS_VTPRESAR: VALIDA_ARTICULO',error)
		next();
	}
}