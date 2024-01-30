const { validateBooleanFunction } = require('../../../../../../utils/validate');
const {log_error}                 = require('../../../../../../utils/logger');
const _                           = require('underscore')

exports.main = async (req, res, next)  => {

const {COD_EMPRESA}	 = req.body;
const COD_PROVEEDOR  = req.body.valor ? req.body.valor : ''

let content 	 = [{COD_EMPRESA,COD_PROVEEDOR}];
let in_params  = content.map( item => { return _.keys(item) });  

var valida 		 = [{
    campo			 : 'COD_EMPRESA'  ,
    paquete		 : 'EDS_STENTSAL.' ,
    funcion		 : 'VALIDA_PROVEEDOR'  ,			
    in_params  : in_params[0],
    out_params : ['DESC_PROVEEDOR']  ,
  }];
try {
  var response = await validateBooleanFunction(content, valida, req);	
  res.status(200).json(response.data);
} catch (error) {
  log_error.error(`EDS_STENTSAL: VALIDA_PROVEEDOR : ${error} `);;
  console.error('EDS_STENTSAL: VALIDA_PROVEEDOR   : ',error)
  next()
}
}