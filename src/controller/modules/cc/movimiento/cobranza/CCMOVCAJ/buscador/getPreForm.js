const { validateProcedure } = require('../../../../../../../utils/validate');
const {log_error}           = require('../../../../../../../utils/logger');
const _                     = require('underscore')

exports.main = async (req, res, next)  => {
  let {COD_EMPRESA = '',COD_USUARIO = '',COD_MODULO = '', COD_SUCURSAL='', FORMNAME=''} = req.body;
  let content = [{ COD_EMPRESA
                ,  COD_USUARIO
                ,  COD_SUCURSAL
                ,  COD_MODULO
                ,  FORMNAME}];
  let in_params = content.map( item => { return _.keys(item) });  
  var valida  = [{
    campo       : 'COD_EMPRESA'   ,
    paquete     : 'EDS_CCMOVCAJ'  ,
    funcion     : 'PRE_FORM'      ,
    in_params   : in_params[0]    ,
    out_params: [ 'TIPO_TRANS'
                , 'EFECTIVO_COBRO'
                , 'CHEQUE_COBRO'
                , 'TIPO_EXTRACCION'
                , 'CHEQUE_A_FECHA'
                , 'TARJETA_COBRO'
                , 'SECTOR_BANCARIO'
                , 'SECTOR_TARJETAS'
                , 'NOTA_CREDITO'
                , 'COD_MONEDA_BASE'
                , 'TIP_MOV_CAJ'
                , 'CAMBIA_FECHA'
                , 'MODIFICA_FECHA_ANT'
                , 'COD_CAJA'
                , 'PERMITIR_BORRAR'
                , 'CARGO_COBRANZA'
              ]
  }];  
  try {
    var response = await validateProcedure(content, valida, req);
    res.status(200).json(response.outBinds); 
  } catch (error) {
    next()
    log_error.error(`[EDS_CCRENAGR] list PRE_FORM ${error}`)
  }
}