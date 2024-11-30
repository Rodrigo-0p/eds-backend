const { validateBooleanFunction } = require('../../../../../../../utils/validate');
const {log_error}                 = require('../../../../../../../utils/logger');
const _                           = require('underscore')

exports.main = async (req, res, next)  => {
const {CARGA_VALORES = '', COD_EMPRESA = '', TIP_DOCUMENTO = '', SER_DOCUMENTO = ''} = req.body
let NRO_DOCUMENTO    = req.body.valor ? req.body.valor : ''
let content 	       = [{CARGA_VALORES,COD_EMPRESA,TIP_DOCUMENTO,SER_DOCUMENTO,NRO_DOCUMENTO}];
let in_params  = content.map( item => { return _.keys(item) });  
var valida 		 = [{
    campo			 : 'COD_EMPRESA'      ,
    paquete		 : 'EDS_CCMOVCAJ.'    ,
    funcion		 : 'UP_NRO_DOCUMENTO' ,
    in_params  : in_params[0]       ,
    out_params : ['MONTO','COD_MONEDA_COBRO'],
    out_type   : {'MONTO':'NUMBER'},
   }];
  try {
    var response = await validateBooleanFunction(content, valida, req);
    res.status(200).json(response.data.outBinds ? response.data.outBinds : response);
  } catch (error) {
    log_error.error(`EDS_CCMOVCAJ: UP_NRO_DOCUMENTO : ${error}`);
    console.error('EDS_CCMOVCAJ: UP_NRO_DOCUMENTO   : ',error)
    next()
  }
}