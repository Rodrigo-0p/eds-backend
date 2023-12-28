const { validateProcedure } = require('../../../../../../utils/validate');
const {log_error}           = require('../../../../../../utils/logger');
const _                     = require('underscore')

exports.main = async (req, res, next)  => {

  let { COD_EMPRESA
      , COD_PROVEEDOR_DFLT = ''
      , COD_RUBRO     = ''
      , COD_MARCA     = ''
      , COD_GRUPO     = ''
      , COD_IVA       = ''
     } = req.body;

  let content = [{  COD_EMPRESA, COD_PROVEEDOR_DFLT, COD_RUBRO, COD_MARCA, COD_GRUPO, COD_IVA }];
  let in_params = content.map( item => { return _.keys(item) });  
  var valida  = [{
    campo       : 'COD_EMPRESA'        ,
    paquete     : 'EDS_STARTICU'       ,
    funcion     : 'POST_QUERY_CABECERA',
    in_params   : in_params[0]         ,
    out_params: [   'DESC_PROVEEDOR'
                  , 'DESC_RUBRO'
                  , 'DESC_MARCA'
                  , 'DESC_GRUPO'
                  , 'DESC_IVA'
                ],
  }];  
  try {
    var response = await validateProcedure(content, valida, req);
    res.status(200).json(response.outBinds); 
  } catch (error) {
    next()
    log_error.error(`[EDS_STARTICU] list POSTQUERY CAB: ${error}`)
  }
}