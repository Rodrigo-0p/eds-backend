const { validateBooleanFunction } = require('../../../../../../utils/validate');
const {log_error}                 = require('../../../../../../utils/logger');
const _                           = require('underscore');
exports.main = async (req, res, next)  => {
  const {COD_EMPRESA, COD_SUCURSAL, COD_CLIENTE, IND_INPASA, CLIENTE_OCASIONAL, COD_CONDICION_VENTA}	= req.body;
  const COD_SUBCLIENTE   = req.body.valor ? req.body.valor : '';
  let content    = [{ COD_EMPRESA, COD_SUCURSAL, COD_CLIENTE, IND_INPASA, CLIENTE_OCASIONAL, COD_CONDICION_VENTA, COD_SUBCLIENTE}];
  let in_params  = content.map( item => { return _.keys(item) });
  var valida 	   = [{
    campo	     : 'COD_SUBCLIENTE',
    paquete	   : 'EDS_VTPEDIDO.',
    funcion	   : 'when_validate_subcliente',
    in_params  : in_params[0],
    out_params : [
      'LIMITE_CREDITO',
      'NOM_SUBCLIENTE',
      'DIR_CLIENTE',
      'COD_ZONA',
      'COD_TIPO',
      'SALDO_ANT',
      'IND_BON',
      'SALDO'
    ],
    bind_type  : {'COD_CONDICION_VENTA' : 'INOUT' },
  }];
  try {
    var response = await validateBooleanFunction(content, valida, req);	
    res.status(200).json(response.data);
  } catch (error) {
    log_error.error(`EDS_VTPEDIDO: when_validate_subcliente : ${error} `);
    console.error('EDS_VTPEDIDO: when_validate_subcliente   : ',error);
    next()
  }
}