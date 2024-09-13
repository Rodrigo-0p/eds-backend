const { validateBooleanFunction } = require('../../../../../../../utils/validate');
const {log_error}                 = require('../../../../../../../utils/logger');
const _                           = require('underscore')

exports.main = async (req, res, next)  => {

let dependencia  =  _.extend( ...req.body.dependencia );
let COD_EMPRESA  = req.body.cod_empresa;
let COD_ARTICULO = req.body.valor;
const { COD_SUCURSAL        = ''
      , CARGA_DETALLE       = 'N'
      , PRECIO_VENTA        = ''
      , COD_MONEDA          = ''
      , IND_VENTA           = ''
      , COD_CONDICION_VENTA = ''
      , COD_LISTA_PRECIO    = ''
      , IND_REG_TURISMO     = ''
      , CANTIDAD            = ''
      , COD_UNIDAD_MEDIDA   = ''} = dependencia
let content 	 = [{ COD_EMPRESA      , COD_SUCURSAL   , COD_ARTICULO, CARGA_DETALLE
                  , PRECIO_VENTA     , COD_MONEDA     , IND_VENTA   , COD_CONDICION_VENTA
                  , COD_LISTA_PRECIO , IND_REG_TURISMO, CANTIDAD    , COD_UNIDAD_MEDIDA}];

let in_params  = content.map( item => { return _.keys(item) });  
var valida 		 = [{
    campo			 : 'COD_EMPRESA'        ,
    paquete		 : 'EDS_CCNCRDEF.'      ,
    funcion		 : 'UP_VALIDA_ARTICULO' ,
    in_params  : in_params[0]         ,
    out_params : ['DESC_ARTICULO'        , 'COD_IVA'
                 ,'PORC_IVA'             , 'PORC_GRAVADA' , 'COSTO_PROM'
                 ,'COSTO_ULTIMO'         , 'MULT'         , 'DIV'
                 ,'NRO_LOTE'             , 'IND_MANEJA_STOCK'
                 ,'PRECIO_UNITARIO_C_IVA', 'PRECIO_UB'    , 'PRECIO_VEN'
                 ,'PRECIO_MIN'           , 'PREC_MIN_PERM', 'PORC_COM'
                 ,'PORC_VTA'             , 'TIP_PROD'     , 'PORC_NEG'
                 ,'PRECIO_NEG'           , 'FEC_VIGENCIA'],
    bind_type  : { COD_UNIDAD_MEDIDA :'INOUT' },
    in_type    : { CANTIDAD          :'NUMBER'
                 , PRECIO_VENTA      :'NUMBER'
                 },
    out_type:{ COD_IVA                : 'NUMBER',
               PORC_COM               : 'NUMBER',
               PORC_GRAVADA           : 'NUMBER',
               PORC_IVA               : 'NUMBER',
               PORC_NEG               : 'NUMBER',
               PORC_VTA               : 'NUMBER',
               PRECIO_MIN             : 'NUMBER',
               PRECIO_NEG             : 'NUMBER',
               PRECIO_UB              : 'NUMBER',
               PRECIO_UNITARIO_C_IVA  : 'NUMBER',
               PRECIO_VEN             : 'NUMBER',
               PREC_MIN_PERM          : 'NUMBER',
               MULT                   : 'NUMBER',
               DIV                    : 'NUMBER',
              }
   }];
  try {
    var response = await validateBooleanFunction(content, valida, req);
    res.status(200).json(response.data);
  } catch (error) {
    log_error.error(`EDS_CCNCRDEF: UP_VALIDA_ARTICULO : ${error}`);
    console.error('EDS_CCNCRDEF: UP_VALIDA_ARTICULO   : ',error)
    next()
  }
  
}