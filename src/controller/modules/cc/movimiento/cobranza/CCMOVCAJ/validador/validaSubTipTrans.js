const { validateBooleanFunction } = require('../../../../../../../utils/validate');
const {log_error}                 = require('../../../../../../../utils/logger');
const _                           = require('underscore')

exports.main = async (req, res, next)  => {
const {COD_EMPRESA = '',COD_MODULO  = '',  TIPO_TRANS  = '', COD_CLIENTE} = req.body
let SUB_TIPO_TRANS = req.body.valor ? req.body.valor : ''
let content 	     = [{COD_EMPRESA,COD_MODULO,TIPO_TRANS, SUB_TIPO_TRANS, COD_CLIENTE}];
let in_params  = content.map( item => { return _.keys(item) });  
var valida 		 = [{
    campo			 : 'COD_EMPRESA'   ,
    paquete		 : 'EDS_CCMOVCAJ.' ,
    funcion		 : 'VALIDA_SUB_TIPO_TRANS' ,
    in_params  : in_params[0]    ,
    out_params : [  'DESC_TRANSACCION' 
                  , 'COD_CUENTA'       
                  , 'NOM_CUENTA'       
                  , 'TIP_DOCUMENTO'    
                  , 'SER_DOCUMENTO'
                  , 'CARGA_VALORES'    
                  , 'CARGA_BANCO_CLI'  
                  , 'CARGA_CUENTA_CLI'    
                  , 'CARGA_DEPOSITO'       
                  , 'CARGA_VENCIMIENTO'      
                  , 'CARGA_CLIENTE'          
                  , 'CONCEPTO'         
                ],
              }];  
  try {
    var response = await validateBooleanFunction(content, valida, req);
    res.status(200).json(response.data.outBinds ? response.data.outBinds : response);
  } catch (error) {
    log_error.error(`EDS_CCMOVCAJ: VALIDA_SUB_TIPO_TRANS : ${error}`);
    console.error('EDS_CCMOVCAJ: VALIDA_SUB_TIPO_TRANS   : ',error)
    next()
  }
  
}