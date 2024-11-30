const { validateBooleanFunction } = require('../../../../../../../utils/validate');
const {log_error}                 = require('../../../../../../../utils/logger');
const _                           = require('underscore')

exports.main = async (req, res, next)  => {
const {COD_EMPRESA = ''} = req.body
let COD_CLIENTE    = req.body.valor ? req.body.valor : ''
let content 	     = [{COD_EMPRESA,COD_CLIENTE}];

let in_params  = content.map( item => { return _.keys(item) });  
var valida 		 = [{
    campo			 : 'COD_EMPRESA'        ,
    paquete		 : 'EDS_CCMOVCAJ.'      ,
    funcion		 : 'VALIDA_CLIENTE_ACT' ,
    in_params  : in_params[0]    ,
    out_params : ['DESC_CLIENTE', 'IND_INPASA'],
   }];
  try {
    var response = await validateBooleanFunction(content, valida, req);
    res.status(200).json(response.data);
  } catch (error) {
    log_error.error(`EDS_CCMOVCAJ: VALIDA_CLIENTE_ACT : ${error}`);
    console.error('EDS_CCMOVCAJ: VALIDA_CLIENTE_ACT   : ',error)
    next()
  }
  
}