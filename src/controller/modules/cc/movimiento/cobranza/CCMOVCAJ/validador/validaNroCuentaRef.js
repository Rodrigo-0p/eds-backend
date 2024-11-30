const { validateBooleanFunction } = require('../../../../../../../utils/validate');
const {log_error}                 = require('../../../../../../../utils/logger');
const _                           = require('underscore')

exports.main = async (req, res, next)  => {
const {COD_EMPRESA = '', COD_BANCO = '', CARGA_CUENTA_CLI = ''} = req.body
let NRO_CUENTA     = req.body.valor ? req.body.valor : ''
let content 	     = [{COD_EMPRESA, COD_BANCO, NRO_CUENTA, CARGA_CUENTA_CLI}];

let in_params  = content.map( item => { return _.keys(item) });  
var valida 		 = [{
    campo			 : 'COD_EMPRESA'           ,
    paquete		 : 'EDS_CCMOVCAJ.'         ,
    funcion		 : 'VALIDA_NRO_CUENTA_REF' ,
    in_params  : in_params[0]            ,
    out_params : ['COD_PER_JURIDICA','NOM_CLIENTE'],
   }];
  try {
    var response = await validateBooleanFunction(content, valida, req);
    res.status(200).json(response.data.outBinds ? response.data.outBinds : response);
  } catch (error) {
    log_error.error(`EDS_CCMOVCAJ: VALIDA_NRO_CUENTA_REF : ${error}`);
    console.error('EDS_CCMOVCAJ: VALIDA_NRO_CUENTA_REF   : ',error)
    next()
  }
  
}