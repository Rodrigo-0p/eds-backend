const { validateProcedure } = require('../../../../../../../utils/validate');
const {log_error}           = require('../../../../../../../utils/logger');
const _                     = require('underscore')

exports.main = async (req, res, next)  => {
  let {COD_EMPRESA = '', COD_SUCURSAL='', FORMNAME='',COD_USUARIO = ''} = req.body;
  let content = [{COD_EMPRESA,FORMNAME,COD_SUCURSAL,COD_USUARIO}];
  
  let in_params = content.map( item => { return _.keys(item) });  
  var valida  = [{
    campo       : 'COD_EMPRESA'   ,
    paquete     : 'EDS_CCRENAGR'  ,
    funcion     : 'PRE_FORM'      ,
    in_params   : in_params[0]    ,
    out_params: [ 'DESC_SUCURSAL'
                , 'NRO_PLANILLA'
                , 'COD_COBRADOR'
                , 'VER_RECIBO'
                , 'DESC_COBRADOR']
  }];  
  try {
    var response = await validateProcedure(content, valida, req);
    res.status(200).json(response.outBinds); 
  } catch (error) {
    next()
    log_error.error(`[EDS_CCRENAGR] list PRE_FORM ${error}`)
  }
}