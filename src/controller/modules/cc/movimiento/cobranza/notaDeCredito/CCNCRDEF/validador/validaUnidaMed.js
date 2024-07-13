const { validateBooleanFunction } = require('../../../../../../../../utils/validate');
const {log_error}                 = require('../../../../../../../../utils/logger');
const _                           = require('underscore')

exports.main = async (req, res, next)  => {

let dependencia  =  _.extend( ...req.body.dependencia );
let COD_EMPRESA  = req.body.cod_empresa;
let COD_UNIDAD_MEDIDA = req.body.valor;
const { COD_ARTICULO    = ''
      , PRECIO_UB       = ''
      , DECIMALES       = ''} = dependencia

let content 	 = [{ COD_EMPRESA , COD_ARTICULO  , COD_UNIDAD_MEDIDA,
                    PRECIO_UB   , DECIMALES}];
let in_params  = content.map( item => { return _.keys(item) });  
var valida 		 = [{
    campo			 : 'COD_EMPRESA'  ,
    paquete		 : 'EDS_CCNCRDEF.',
    funcion		 : 'VALIDA_UM'    ,
    in_params  : in_params[0]   ,
    out_params : ['DESC_UNIDAD_MEDIDA', 'MULT', 'DIV', 'PRECIO_UNITARIO_C_IVA'],
    in_type    : { DECIMALES             :'NUMBER'},
    out_type   : { PRECIO_UNITARIO_C_IVA :'NUMBER'}
   }];
  try {
    var response = await validateBooleanFunction(content, valida, req);
    res.status(200).json(response.data);
  } catch (error) {
    log_error.error(`EDS_CCNCRDEF: VALIDA_UM : ${error}`);
    console.error('EDS_CCNCRDEF: VALIDA_UM   : ',error)
    next()
  }
  
}