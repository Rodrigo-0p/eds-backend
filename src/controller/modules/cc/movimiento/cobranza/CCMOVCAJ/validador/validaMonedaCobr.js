const { validateBooleanFunction } = require('../../../../../../../utils/validate');
const {log_error}                 = require('../../../../../../../utils/logger');
const _                           = require('underscore')

exports.main = async (req, res, next)  => {
const {COD_EMPRESA, FEC_MOV_CAJ = '', CARGA_RETENCION = '', COD_USUARIO = ''} = req.body
let COD_MONEDA_COBRO = req.body.valor ? req.body.valor : ''
let content 	 = [{COD_EMPRESA,COD_MONEDA_COBRO,FEC_MOV_CAJ,CARGA_RETENCION,COD_USUARIO}];

let in_params  = content.map( item => { return _.keys(item) });  
var valida 		 = [{
    campo			 : 'COD_EMPRESA'          ,
    paquete		 : 'EDS_CCMOVCAJ.'       ,
    funcion		 : 'VALIDA_MONEDA_COBRO' ,
    in_params  : in_params[0]          ,
    out_params : [ 'DESC_MONEDA'
                 , 'DECIMALES'
                 , 'TIP_CAMBIO'
                 , 'NRO_CUENTA_CAJA_CHICA'
                 , 'DESC_CAJA_CHICA'
                 , 'COD_BANCO_CAJA_CHICA'
                ],
    out_type   : { 'TIP_CAMBIO':'NUMBER'
                 , 'DECIMALES' :'NUMBER'},
   }];
  try {
    var response = await validateBooleanFunction(content, valida, req);
    res.status(200).json(response.data.outBinds ? response.data.outBinds : response);
  } catch (error) {
    log_error.error(`EDS_CCMOVCAJ: VALIDA_MONEDA_COBRO : ${error}`);
    console.error('EDS_CCMOVCAJ: VALIDA_MONEDA_COBRO   : ',error)
    next()
  }
  
}
