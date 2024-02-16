const { validateBooleanFunction } = require('../../../../../../utils/validate');
const {log_error}                 = require('../../../../../../utils/logger');
const _                           = require('underscore')
const moment                      = require('moment');

exports.main = async (req, res, next)  => {

let COD_EMPRESA	 = req.body.cod_empresa;
let COD_SUCURSAL = req.body.dependencia[0].COD_SUCURSAL;
let COD_ARTICULO = req.body.valor ? req.body.valor : ''
let IND_ENT_SAL  = 'S';

let content 	   = [{COD_EMPRESA,COD_SUCURSAL,COD_ARTICULO,IND_ENT_SAL}];
let in_params    = content.map( item => { return _.keys(item) });  

var valida 		 = [{
    campo			 : 'COD_ARTICULO'       ,
    paquete		 : 'EDS_STENVIO.'       ,
    funcion		 : 'VALIDA_DEPOSITO'    ,			
    in_params  : in_params[0]         ,
    out_params : ['DESC_DEPOSITO_ENT'],  
  }];
  try {
    var response = await validateBooleanFunction(content, valida, req);	
    res.status(200).json(response.data);
  } catch (error) {
    log_error.error(`EDS_STENVIO: VALIDA_DEPOSITO_ENT : ${error} `);;
    console.error('EDS_STENVIO: VALIDA_DEPOSITO_ENT   : ',error)
    next()
  }
}