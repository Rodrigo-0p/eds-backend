const { validateBooleanFunction } = require('../../../../../../../../utils/validate');
const {log_error}                 = require('../../../../../../../../utils/logger');
const _                           = require('underscore')

exports.main = async (req, res, next)  => {
  let {COD_EMPRESA = '', FORMNAME=''} = req.body;
  let content = [{COD_EMPRESA ,FORMNAME}];

  let in_params = content.map( item => { return _.keys(item) });  
  var valida  = [{
    campo       : 'COD_EMPRESA'   ,
    paquete     : 'EDS_CCNCRDEF.' ,
    funcion     : 'PRE_FORM'      ,
    in_params   : in_params[0]    ,
    out_params: [  'TIP_COMP'         
                  , 'MONEDA_BASE'      
                  , 'MONEDA_DOLAR'     
                  , 'LOTE_DLFT'        
                  , 'FEC_VENC_LOTE_DF' 
                  , 'LINEA_MAX'        
                  , 'CLIENTE_OCA'      
                  , 'PERMITE_ANULAR'   
                  , 'CAMBIA_SUC'       
                  , 'CARGA_FEC'        
                  , 'CAMBIA_PRECIO'    
                  , 'CAMBIA_COND'      
                  , 'APLICA_DESC_FIN'  
                  , 'APLICA_DESC_VAR'  
                  , 'TIP_CAMBIO_US'
                ]
  }];  
  try {
    var response = await validateBooleanFunction(content, valida, req);
    res.status(200).json(response.data.outBinds); 
  } catch (error) {
    next()
    log_error.error(`[EDS_CCNCRDEF] list PRE_FORM ${error}`)
  }
}