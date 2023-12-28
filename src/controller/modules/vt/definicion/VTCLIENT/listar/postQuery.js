const { validateProcedure } = require('../../../../../../utils/validate');
const {log_error}           = require('../../../../../../utils/logger');
const _                     = require('underscore')

exports.main = async (req, res, next)  => {
  
  let { COD_EMPRESA, COD_CLIENTE      , COD_PERSONA     , COD_CONDICION_VENTA ,
        COD_CAUSAL , COD_MONEDA_LIMITE, COD_GRUPO_CLIENTE,COD_USUARIO
    } = req.body;

  let content = [{  COD_EMPRESA, COD_CLIENTE      , COD_PERSONA     , COD_CONDICION_VENTA, 
                    COD_CAUSAL , COD_MONEDA_LIMITE, COD_GRUPO_CLIENTE,COD_USUARIO }];

  let in_params = content.map( item => { return _.keys(item) });  
  var valida = [{
  campo     : 'COD_EMPRESA',
  paquete   : 'EDS_VTCLIENT',
  funcion   : 'POST_QUERY_CLIENTE',
  in_params : in_params[0] ,
  out_params: [   'SALDO_FACT'
                , 'SALDO_VAL'
                , 'DESC_CONDICION_VENTA'
                , 'DESC_CAUSAL'
                , 'DESC_MONEDA_LIMITE'
                , 'DESC_GRUPO_CLIENTE'
                , 'NOMBRE'
                , 'NOMB_FANTASIA'
                , 'DIRECCION_CAB'
                , 'TELEFONO'
                , 'RUC'
                , 'CI'
                , 'CIUDAD'
                , 'TELEF_CELULAR'
                , 'PAIS'
                , 'PROVINCIA'
                , 'NRO_DOCUMENTO'
                , 'BLOQUEAR_CLIENTE'
                , 'CAD_LIMITE_SUPERIOR'
                , 'LIMITE_CREDITO_ANT'
            ],
    out_type : { LIMITE_CREDITO : 'NUMBER'},
  }];  

  try {
    var response = await validateProcedure(content, valida, req);
    res.status(200).json(response.outBinds); 
  } catch (error) {
    next()
    log_error.error(`[EDS_VTCLIENT] list POSTQUERY CAB: ${error}`)
  }
}