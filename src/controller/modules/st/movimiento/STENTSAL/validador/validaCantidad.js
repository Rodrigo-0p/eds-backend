const { validateBooleanFunction } = require('../../../../../../utils/validate');
const {log_error}                 = require('../../../../../../utils/logger');
const _                           = require('underscore')

exports.main = async (req, res, next)  => {

let COD_EMPRESA	   = req.body.cod_empresa;
let COD_SUCURSAL	 = req.body.dependencia[0].COD_SUCURSAL;
let COD_DEPOSITO	 = req.body.dependencia[1]  ? req.body.dependencia[1].COD_DEPOSITO     : '';
let IND_ENT_SAL  	 = req.body.dependencia[2]  ? req.body.dependencia[2].IND_ENT_SAL      : '';
let DECIMALES   	 = req.body.dependencia[2]  ? req.body.dependencia[3].DECIMALES        : '';
let COD_ARTICULO   = req.body.dependencia[3]  ? req.body.dependencia[4].COD_ARTICULO     : '';
let NRO_LOTE       = req.body.dependencia[4]  ? req.body.dependencia[5].NRO_LOTE         : '';
let CANTIDAD_ANT   = req.body.dependencia[5]  ? req.body.dependencia[6].CANTIDAD_ANT     : '';
let MULT           = req.body.dependencia[6]  ? req.body.dependencia[7].MULT             : '';
let DIV            = req.body.dependencia[7]  ? req.body.dependencia[8].DIV              : '';
let DESC_ART       = req.body.dependencia[8]  ? req.body.dependencia[9].DESC_ARTICULO    : '';
let DESC_UM        = req.body.dependencia[9]  ? req.body.dependencia[10].DESC_UM         : '';
let COSTO_UNITARIO = req.body.dependencia[10] ? req.body.dependencia[11].COSTO_UNITARIO  : '';
let CANTIDAD       = req.body.valor ? req.body.valor : ''

let content 	    = [{COD_EMPRESA,COD_ARTICULO,COD_SUCURSAL,COD_DEPOSITO,DESC_ART,DESC_UM,IND_ENT_SAL,CANTIDAD,MULT,DIV,DECIMALES,NRO_LOTE,CANTIDAD_ANT,COSTO_UNITARIO}];
let in_params     = content.map( item => { return _.keys(item) });  

var valida 		 = [{
    campo			 : 'COD_EMPRESA'    ,
    paquete		 : 'EDS_STENTSAL.'  ,
    funcion		 : 'VALIDA_CANTIDAD',
    in_params  : in_params[0]     ,
    out_params : ['CANTIDAD_UB','MONTO_TOTAL','COSTO_UB']  ,
    in_type    : {CANTIDAD:'NUMBER',MULT:'NUMBER',DIV:'NUMBER',CANTIDAD_ANT:'NUMBER',COSTO_UNITARIO:'NUMBER',DECIMALES:'NUMBER'},
    out_type   : {CANTIDAD_UB:'NUMBER',MONTO_TOTAL:'NUMBER',COSTO_UB:'NUMBER'},
    // bind_type  : { COSTO_UNITARIO :'INOUT'},
  }];  
  try {
    var response = await validateBooleanFunction(content, valida, req);	
    res.status(200).json(response.data);
  } catch (error) {
    log_error.error(`EDS_STENTSAL: VALIDA_CANTIDAD : ${error} `);;
    console.error('EDS_STENTSAL: VALIDA_CANTIDAD   : ',error)
    next()
  }
}