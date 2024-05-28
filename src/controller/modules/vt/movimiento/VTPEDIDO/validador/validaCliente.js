const { validateBooleanFunction } = require('../../../../../../utils/validate');
const {log_error}                 = require('../../../../../../utils/logger');
const _                           = require('underscore')
const moment = require('moment');
exports.main = async (req, res, next)  => {
  const {COD_EMPRESA, SALDO_ANT, IND_REPARTO, CLIENTE_OCASIONAL, COD_SUCURSAL }	= req.body;
  let FEC_COMPROBANTE =  moment(req.body.FEC_COMPROBANTE.slice(0,10)).format('DD/MM/YYYY'); 
  const COD_CLIENTE = req.body.valor ? req.body.valor : ''
  FEC_COMPROBANTE = null;
  let content 	= [{COD_EMPRESA,FEC_COMPROBANTE,SALDO_ANT, IND_REPARTO, CLIENTE_OCASIONAL, COD_SUCURSAL, COD_CLIENTE}];
  
  console.log( content );

  let in_params = content.map( item => { return _.keys(item) });
  var valida 	  = [{
    campo	      : 'COD_CLIENTE',
    paquete		  : 'EDS_VTPEDIDO.',
    funcion		  : 'WHEN_VALIDATE_CLIENTE',			
    in_params   : in_params[0],
    out_params  : [
      'NOM_CLIENTE',
      'RUC',
      'TEL_CLIENTE',
      'COD_CONDICION_VENTA',
      'TIPO_VENTA',
      'DIAS_INICIAL',
      'LIMITE_CREDITO',
      'SIGLAS',
      'IND_SUBCLI',
      'IND_VARIAS_UM',
      'IND_PORC_VTA',
      'IND_REG_TURISMO',
      'IND_INPASA',
      'CI',
      'SALDO',
      'COD_SUBCLIENTE',
      'NOM_SUBCLIENTE',
      'COD_TIPO',
      'COD_DEPOSITO',
      'DESC_DEPOSITO',
      'BLOQUEADO_X_VTO',
      'COD_LISTA_PRECIO'
    ],
  }];
  try {
    var response = await validateBooleanFunction(content, valida, req);	

    console.log( response.data );

    res.status(200).json(response.data);
  } catch (error) {
    log_error.error(`EDS_VTPEDIDO: WHEN_VALIDATE_CLIENTE : ${error} `);
    console.error('EDS_VTPEDIDO: WHEN_VALIDATE_CLIENTE   : ',error);
    next()
  }
}