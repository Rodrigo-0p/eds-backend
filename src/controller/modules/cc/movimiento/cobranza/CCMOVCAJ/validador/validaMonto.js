const { validateBooleanFunction } = require('../../../../../../../utils/validate');
const {log_error}                 = require('../../../../../../../utils/logger');
const _                           = require('underscore')

exports.main = async (req, res, next)  => {
const {COD_EMPRESA       = '',
       CONCEPTO          = '',
       COD_MONEDA_COBRO  = '',
       COD_MONEDA        = '',
       TIP_CAMBIO        = '',
       TIP_CAMBIO_CAB    = '',
       TOTAL             = '',
       TOT_NRO_MOV_CAJ   = '',
       COD_MONEDA_BASE   = '',
       TIP_DOCUMENTO     = '',
       SER_DOCUMENTO     = '',
       NRO_DOCUMENTO     = ''} = req.body


let MONTO      = req.body.valor ? req.body.valor : ''

let content 	 = [{ COD_EMPRESA
                  , CONCEPTO
                  , COD_MONEDA_COBRO
                  , COD_MONEDA
                  , MONTO
                  , TIP_CAMBIO
                  , TIP_CAMBIO_CAB
                  , TOTAL
                  , TOT_NRO_MOV_CAJ
                  , COD_MONEDA_BASE
                  , TIP_DOCUMENTO
                  , SER_DOCUMENTO
                  , NRO_DOCUMENTO
                }];

// console.log(content);

let in_params  = content.map( item => { return _.keys(item) });  
var valida 		 = [{
    campo			 : 'COD_MONEDA_CAB'      ,
    paquete		 : 'EDS_CCMOVCAJ.'       ,
    funcion		 : 'VALIDA_MONTO'        ,
    //
    in_params  : in_params[0]          ,
    in_type    : {'MONTO'          :'NUMBER'
                 ,'TIP_CAMBIO'     :'NUMBER'
                 ,'TIP_CAMBIO_CAB' :'NUMBER'
                 ,'TOTAL'          :'NUMBER'
                 ,'TOT_NRO_MOV_CAJ':'NUMBER'
                 },
    // 
    out_params : ['IMPORTE','IMPORTE_ANT','DIFERENCIA'],
    out_type   : {'IMPORTE'    :'NUMBER'
                 ,'IMPORTE_ANT':'NUMBER'
                 ,'DIFERENCIA' :'NUMBER'},
   }];
  try {
    var response = await validateBooleanFunction(content, valida, req);
    res.status(200).json(response.data.outBinds ? response.data.outBinds : response);
  } catch (error) {
    log_error.error(`EDS_CCMOVCAJ: VALIDA_MONTO : ${error}`);
    console.error('EDS_CCMOVCAJ: VALIDA_MONTO   : ',error)
    next()
  }
  
}
                        
                        
                        
                        
                        

                        
                        
                        
                        
                        