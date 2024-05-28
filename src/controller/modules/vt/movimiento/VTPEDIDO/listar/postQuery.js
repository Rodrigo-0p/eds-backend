const { validateProcedure } = require('../../../../../../utils/validate');
const {log_error}           = require('../../../../../../utils/logger');
const _                     = require('underscore')

exports.main = async (req, res, next)  => {
  let { COD_EMPRESA = '', 
        COD_SUCURSAL = '', 
        TIP_COMPROBANTE = '', 
        SER_COMPROBANTE = '',
        NRO_COMPROBANTE = '',
        COD_CLIENTE = '',
        COD_SUBCLIENTE = '',
        COD_VENDEDOR = '',
        VENDEDOR_PERSONA = '',
        COD_LISTA_PRECIO = '',
        COD_CONDICION_VENTA = '',
        COD_MONEDA = '',
        COD_MONEDA_BASE = '',
        COD_DEPOSITO = '',
        COD_ZONA = '',
        PORC_DESC_FIN = '',
        PORC_DESC_VAR = ''
     } = req.body;
  let content = [{ 
		COD_EMPRESA,
		COD_SUCURSAL,
    TIP_COMPROBANTE,
    SER_COMPROBANTE,
    NRO_COMPROBANTE,
    COD_CLIENTE,
    COD_SUBCLIENTE,
    COD_VENDEDOR,
    VENDEDOR_PERSONA,
    COD_LISTA_PRECIO,
    COD_CONDICION_VENTA,
    COD_MONEDA,
    COD_MONEDA_BASE,
    COD_DEPOSITO,
		COD_ZONA,
    PORC_DESC_FIN,
    PORC_DESC_VAR
	}];
  let in_params = content.map( item => { return _.keys(item) });  
  var valida  = [{
    campo       : 'COD_EMPRESA'        ,
    paquete     : 'EDS_VTPEDIDO'       ,
    funcion     : 'POST_QUERY_CABECERA',
    in_params   : in_params[0]         ,
    out_params: [  	'DESC_SUCURSAL'
                	, 'DESC_VENDEDOR'
                	, 'DESC_LISTA_PRECIO' 
                	, 'DESC_CONDICION' 
                	, 'TIPO' 
                	, 'IND_TIPO' 
                	, 'DESC_MONEDA' 
                	, 'DESC_DEPOSITO' 
                	, 'DESCIMALES' 
                	, 'SIGLAS' 
                	, 'DESC_ZONA' 
                	, 'IND_VTA_ESP' 
                	, 'COD_TIPO' 
                	, 'IVA5' 
                	, 'IVA10' 
                	, 'GRAV5' 
                	, 'GRAV10' 
                	, 'SUBTOTAL' 
                	, 'INS_VARIAS_UM' 
                	, 'LIM_PORC_DESC' 
                ],
  }];  
  try {
    var response = await validateProcedure(content, valida, req);  
    res.status(200).json(response.outBinds); 
  } catch (error) {
    next()
    log_error.error(`[EDS_VTPEDIDO] list POSTQUERY CAB: ${error}`)
  }
}