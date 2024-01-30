const { validateBooleanFunction } = require('../../../../../../utils/validate');
const {log_error}                 = require('../../../../../../utils/logger');
const _                           = require('underscore')

exports.main = async (req, res, next)  => {

const {COD_EMPRESA,COD_LINEA}	 = req.body;
const COD_CATEGORIA            = req.body.valor ? req.body.valor : ''

let content 	 = [{COD_EMPRESA,COD_LINEA,COD_CATEGORIA}];
let in_params  = content.map( item => { return _.keys(item) });  

var valida 		 = [{
    campo			 : 'COD_CATEGORIA'          ,
    paquete		 : 'EDS_STARTICU.'    ,
    funcion		 : 'valida_segmento'  ,			
    in_params  : in_params[0]       ,
    out_params : ['DESC_CATEGORIA'] ,
  }];
try {
  var response = await validateBooleanFunction(content, valida, req);	
  res.status(200).json(response.data);
} catch (error) {
  log_error.error(`EDS_STARTICU: VALIDA_SEGMENTO : ${error} `);;
  console.error('EDS_STARTICU: VALIDA_SEGMENTO   : ',error)
  next()
}
}