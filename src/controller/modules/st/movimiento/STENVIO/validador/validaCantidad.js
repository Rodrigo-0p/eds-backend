const { validateBooleanFunction } = require('../../../../../../utils/validate');
const {log_error}                 = require('../../../../../../utils/logger');
const _                           = require('underscore')

exports.main = async (req, res, next)  => {

let COD_EMPRESA	   = req.body.cod_empresa;
let COD_SUCURSAL   = req.body.dependencia[0]  ? req.body.dependencia[0].COD_SUCURSAL   : '';
let COD_ARTICULO   = req.body.dependencia[1]  ? req.body.dependencia[1].COD_ARTICULO   : '';
let COD_DEPOSITO   = req.body.dependencia[2]  ? req.body.dependencia[2].COD_DEPOSITO   : '';
let NRO_LOTE       = req.body.dependencia[2]  ? req.body.dependencia[3].NRO_LOTE       : '';
let CANTIDAD_ANT   = req.body.dependencia[3]  ? req.body.dependencia[4].CANTIDAD_ANT   : '';
let MULT           = req.body.dependencia[4]  ? req.body.dependencia[5].MULT           : '';
let DIV            = req.body.dependencia[5]  ? req.body.dependencia[6].DIV            : '';
let DESC_ARTICULO  = req.body.dependencia[6]  ? req.body.dependencia[7].DESC_ARTICULO  : '';
let DESC_UM        = req.body.dependencia[7]  ? req.body.dependencia[8].DESC_UM        : '';

let CANTIDAD       = req.body.valor ? req.body.valor : ''

let content 	    = [{COD_EMPRESA,COD_ARTICULO,COD_SUCURSAL,COD_DEPOSITO,NRO_LOTE,DESC_ARTICULO,DESC_UM,CANTIDAD,MULT,DIV,CANTIDAD_ANT}];
let in_params     = content.map( item => { return _.keys(item) });  

var valida 		 = [{
    campo			 : 'COD_EMPRESA'    ,
    paquete		 : 'EDS_STENVIO.'   ,
    funcion		 : 'VALIDA_CANTIDAD',
    in_params  : in_params[0]     ,
    out_params : ['CANTIDAD_UB']  ,
    in_type    : {CANTIDAD:'NUMBER',MULT:'NUMBER',DIV:'NUMBER',CANTIDAD_ANT:'NUMBER'},
    out_type   : {CANTIDAD_UB:'NUMBER'},
  }];  
  try {
    var response = await validateBooleanFunction(content, valida, req);	
    res.status(200).json(response.data);
  } catch (error) {
    log_error.error(`EDS_STENVIO: VALIDA_CANTIDAD : ${error} `);;
    console.error('EDS_STENVIO: VALIDA_CANTIDAD   : ',error)
    next()
  }
}