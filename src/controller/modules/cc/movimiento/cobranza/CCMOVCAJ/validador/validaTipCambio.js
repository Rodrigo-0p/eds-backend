const { validateBooleanFunction } = require('../../../../../../../utils/validate');
const {log_error}                 = require('../../../../../../../utils/logger');
const _                           = require('underscore')

exports.main = async (req, res, next)  => {
const {COD_MONEDA = '', COD_MONEDA_COBRO = '', MONTO = '' ,TIP_CAMBIO_CAB = ''} = req.body
let TIP_CAMBIO = req.body.valor ? req.body.valor : '';
const content  = [{COD_MONEDA_COBRO,COD_MONEDA,MONTO,TIP_CAMBIO,TIP_CAMBIO_CAB}];
let in_params  = content.map( item => { return _.keys(item) });  
var valida 		 = [{
    campo			 : 'COD_MONEDA_CAB'      ,
    paquete		 : 'EDS_CCMOVCAJ.'       ,
    funcion		 : 'VALIDA_TIP_CAMBIO'   ,
    in_params  : in_params[0]          ,
    in_type    : {'MONTO'          :'NUMBER'
                , 'TIP_CAMBIO'     :'NUMBER'
                , 'TIP_CAMBIO_CAB' :'NUMBER'
              },
    out_params : ['IMPORTE','IMPORTE_ANT'],
    out_type   : {'IMPORTE'    :'NUMBER'
                 ,'IMPORTE_ANT':'NUMBER'
                },
   }];
  try {
    var response = await validateBooleanFunction(content, valida, req);
    res.status(200).json(response.data.outBinds ? response.data.outBinds : response);
  } catch (error) {
    log_error.error(`EDS_CCMOVCAJ: VALIDA_TIP_CAMBIO : ${error}`);
    console.error('EDS_CCMOVCAJ: VALIDA_TIP_CAMBIO   : ',error)
    next()
  }
  
}