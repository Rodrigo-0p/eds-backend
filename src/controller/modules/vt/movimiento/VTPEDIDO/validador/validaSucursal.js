const { validateBooleanFunction } = require('../../../../../../utils/validate');
const {log_error}                 = require('../../../../../../utils/logger');
const _                           = require('underscore')
exports.main = async (req, res, next)  => {
  const {COD_EMPRESA}	 = req.body;
  const COD_SUCURSAL   = req.body.valor ? req.body.valor : ''
  let content 	 = [{COD_EMPRESA,COD_SUCURSAL}];
  let in_params  = content.map( item => { return _.keys(item) });
  var valida 		 = [{
      campo			 : 'COD_SUCURSAL',
      paquete		 : 'EDS_VTPEDIDO.',
      funcion		 : 'VALIDA_SUCURSAL',			
      in_params  : in_params[0],
      out_params : ['DESC_SUCURSAL'],
    }];
  try {
    var response = await validateBooleanFunction(content, valida, req);	
    res.status(200).json(response.data);
  } catch (error) {
    log_error.error(`EDS_VTPEDIDO: VALIDA_SUCURSAL : ${error} `);
    console.error('EDS_VTPEDIDO: VALIDA_SUCURSAL   : ',error);
    next()
  }
}