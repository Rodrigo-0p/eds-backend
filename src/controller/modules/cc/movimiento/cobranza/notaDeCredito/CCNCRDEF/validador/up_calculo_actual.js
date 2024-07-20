const { validateBooleanFunction } = require('../../../../../../../../utils/validate');
const {log_error}                 = require('../../../../../../../../utils/logger');
const _                           = require('underscore')

exports.main = async (req, res, next)  => {

const {DECIMALES = '', MULT = '', DIV = '', PORC_GRAVADA = '',CANTIDAD, 
       PRECIO_UNITARIO_C_IVA = '', PORC_DESC_VAR ='' , PORC_DESC_FIN = '', PORC_IVA = '', PRECIO_UNITARIO = '',
       MONTO_ANT_GRAV = '', MONTO_ANT_EXEN = '', IVA_ANT = '', TOT_IVA = '', TOT_GRAVADAS ='', TOT_EXENTAS = ''}  = req.body

let content 	 = [{DECIMALES     , MULT           , DIV    , PORC_GRAVADA , CANTIDAD, 
                   PRECIO_UNITARIO_C_IVA, PORC_DESC_VAR    , PORC_DESC_FIN, PORC_IVA, PRECIO_UNITARIO,
                   MONTO_ANT_GRAV, MONTO_ANT_EXEN, IVA_ANT, TOT_IVA, TOT_GRAVADAS  , TOT_EXENTAS}];
let in_params  = content.map( item => { return _.keys(item) });  
 valida 		 = [{
    campo			 : 'DECIMALES'         ,
    paquete		 : 'EDS_CCNCRDEF.'     ,
    funcion		 : 'UP_CALCULO_ACTUAL' ,
    in_params  : in_params[0]        ,
    bind_type  : { MONTO_ANT_GRAV  : 'INOUT' ,
                   MONTO_ANT_EXEN  : 'INOUT' ,
                   IVA_ANT         : 'INOUT' ,
                   TOT_GRAVADAS    : 'INOUT' ,
                   TOT_EXENTAS     : 'INOUT' ,
                 },
  out_params : ['CANTIDAD_UB'  , 'MONTO_TOTAL_C_IVA', 'DESCUENTO_VAR',
                'DESCUENTO_FIN', 'TOTAL_IVA'        , 'PRECIO_UB',
                'TOT_GRAVADA'  ,  'TOT_EXENTA'      , 'DESC_FIN_ANT',
                'DESC_VAR_ANT'],
  in_type    :  { DECIMALES             : 'NUMBER',
                  MULT                  : 'NUMBER',
                  DIV                   : 'NUMBER',
                  PORC_GRAVADA          : 'NUMBER',
                  CANTIDAD              : 'NUMBER',
                  PRECIO_UNITARIO_C_IVA : 'NUMBER',
                  PORC_DESC_VAR         : 'NUMBER',
                  PORC_DESC_FIN         : 'NUMBER',
                  PORC_IVA              : 'NUMBER',
                  PRECIO_UNITARIO       : 'NUMBER',
                  MONTO_ANT_GRAV        : 'NUMBER',
                  MONTO_ANT_EXEN        : 'NUMBER',
                  IVA_ANT               : 'NUMBER',
                  TOT_IVA               : 'NUMBER',
                  TOT_GRAVADAS          : 'NUMBER',
                  TOT_EXENTAS           : 'NUMBER',
                },
    out_type    : { CANTIDAD_UB       : 'NUMBER',
                    MONTO_TOTAL_C_IVA : 'NUMBER',
                    DESCUENTO_VAR     : 'NUMBER',
                    DESCUENTO_FIN     : 'NUMBER',
                    TOTAL_IVA         : 'NUMBER',
                    PRECIO_UB         : 'NUMBER',
                    TOT_GRAVADA       : 'NUMBER',
                    TOT_EXENTA        : 'NUMBER',
                    DESC_FIN_ANT      : 'NUMBER',
                    DESC_VAR_ANT      : 'NUMBER',
                    MONTO_ANT_GRAV    : 'NUMBER',
                    MONTO_ANT_EXEN    : 'NUMBER',
                    TOT_IVA           : 'NUMBER',
                    TOT_GRAVADAS      : 'NUMBER',
                    TOT_EXENTAS       : 'NUMBER'},
   }];
  try {
    var response = await validateBooleanFunction(content, valida, req);    
    res.status(200).json(response.data);
  } catch (error) {
    log_error.error(`EDS_CCNCRDEF: UP_CALCULO_ACTUAL : ${error}`);
    console.error('EDS_CCNCRDEF: UP_CALCULO_ACTUAL   : ',error)
    next()
  }
  
}