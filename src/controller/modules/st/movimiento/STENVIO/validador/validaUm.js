const { validateBooleanFunction } = require('../../../../../../utils/validate');
const {log_error}                 = require('../../../../../../utils/logger');
const _                           = require('underscore')

exports.main = async (req, res, next)  => {

let COD_EMPRESA	  = req.body.cod_empresa;
let COD_ARTICULO	= req.body.dependencia[0].COD_ARTICULO;
let COD_UM        = req.body.valor ? req.body.valor : ''

let content 	    = [{COD_EMPRESA,COD_ARTICULO,COD_UM}];
let in_params     = content.map( item => { return _.keys(item) });  
var valida 		 = [{
    campo			 : 'COD_UM'        ,
    paquete		 : 'EDS_STENVIO.'  ,
    funcion		 : 'VALIDA_UM'     ,			
    in_params  : in_params[0]    ,
    out_params : ['DESC_UM','MULT','DIV'],
    out_type   : {MULT:'NUMBER',DIV:'NUMBER'},
  }];
  try {
    var response = await validateBooleanFunction(content, valida, req);	
    res.status(200).json(response.data);
  } catch (error) {
    log_error.error(`EDS_STENVIO: VALIDA_UM : ${error} `);;
    console.error('EDS_STENVIO: VALIDA_UM   : ',error)
    next()
  }
}