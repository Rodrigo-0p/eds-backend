const { validateBooleanFunction } = require('../../../../../../utils/validate');
const {log_error}                 = require('../../../../../../utils/logger');
const _                           = require('underscore');
exports.main = async (req, res, next)  => {
let { COD_EMPRESA, COD_SUCURSAL, COD_LISTA_PRECIO }	 = req.body; 
let COD_DEPOSITO = req.body.valor ? req.body.valor : ''
let content 	  = [{COD_EMPRESA,COD_SUCURSAL,COD_LISTA_PRECIO,COD_DEPOSITO}];
let in_params   = content.map( item => { return _.keys(item) });  
var valida 		 = [{
    campo			 : 'COD_DEPOSITO',
    paquete		 : 'EDS_VTPEDIDO.',
    funcion		 : 'when_validate_deposito',
    in_params  : in_params[0],
    out_params : ['DESC_DEPOSITO'],
  }];
  try {
    var response = await validateBooleanFunction(content, valida, req);	
    res.status(200).json(response.data);
  } catch (error) {
    log_error.error(`EDS_VTPEDIDO: when_validate_deposito : ${error} `);
    console.error('EDS_VTPEDIDO: when_validate_deposito   : ',error);
    next()
  }
}