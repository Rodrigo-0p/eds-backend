const { validateBooleanFunction } = require('../../../../../../utils/validate');
const {log_error}                 = require('../../../../../../utils/logger');
const _                           = require('underscore')

exports.main = async (req, res, next)  => {

let COD_EMPRESA	  = req.body.cod_empresa;
let COD_SUCURSAL	= req.body.dependencia[0].COD_SUCURSAL;
let COD_MONEDA	  = req.body.dependencia[1] ? req.body.dependencia[1].COD_MONEDA   : '';
let TIP_CAMBIO	  = req.body.dependencia[2] ? req.body.dependencia[2].TIP_CAMBIO   : '';
let DECIMALES 	  = req.body.dependencia[3] ? req.body.dependencia[3].DECIMALES    : 0;
let COD_ARTICULO 	= req.body.dependencia[4] ? req.body.dependencia[4].COD_ARTICULO : 0;
let COD_UM        = req.body.valor ? req.body.valor : ''

let content 	    = [{COD_EMPRESA,COD_ARTICULO,COD_UM,COD_SUCURSAL,COD_MONEDA,TIP_CAMBIO,DECIMALES}];
let in_params     = content.map( item => { return _.keys(item) });  
var valida 		 = [{
    campo			 : 'COD_UM'  ,
    paquete		 : 'EDS_STENTSAL.' ,
    funcion		 : 'VALIDA_UM'     ,			
    in_params  : in_params[0]    ,
    out_params : ['DESC_UM','MULT','DIV','COSTO_UNITARIO'],
    in_type    : {TIP_CAMBIO:'NUMBER',DECIMALES:'NUMBER'},
    out_type   : {MULT:'NUMBER',DIV:'NUMBER',COSTO_UNITARIO:'NUMBER'},
  }];
try {
  var response = await validateBooleanFunction(content, valida, req);	
  res.status(200).json(response.data);
} catch (error) {
  log_error.error(`EDS_STENTSAL: VALIDA_UM : ${error} `);;
  console.error('EDS_STENTSAL: VALIDA_UM   : ',error)
  next()
}
}