const { validateBooleanFunction } = require('../../../../../../utils/validate');
const {log_error}                 = require('../../../../../../utils/logger');
const _                           = require('underscore')

exports.main = async (req, res, next)  => {

const COD_EMPRESA	= req.body.cod_empresa;
const COD_CAUSA   = req.body.valor ? req.body.valor : ''

let content 	 = [{COD_EMPRESA,COD_CAUSA}];
let in_params  = content.map( item => { return _.keys(item) });  

var valida 		 = [{
    campo			 : 'COD_CAUSA'     ,
    paquete		 : 'EDS_STENVIO.'  ,
    funcion		 : 'VALIDA_CAUSA'  ,			
    in_params  : in_params[0],
    out_params : ['DESC_CAUSA']  ,
  }];
try {
  var response = await validateBooleanFunction(content, valida, req);	
  res.status(200).json(response.data);
} catch (error) {
  log_error.error(`EDS_STENVIO: VALIDA_CAUSA : ${error} `);;
  console.error('EDS_STENVIO: VALIDA_CAUSA   : ',error)
  next()
}
}