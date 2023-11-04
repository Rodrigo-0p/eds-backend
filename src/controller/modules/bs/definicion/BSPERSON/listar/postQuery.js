const { validateProcedure } = require('../../../../../../utils/validate');
const {log_error}           = require('../../../../../../utils/logger');
const _                     = require('underscore')

exports.main = async (req, res, next)  => {
  
  let { TIPO_SOCIEDAD  , COD_SECTOR     ,  COD_PAIS       ,
        COD_PROVINCIA  , COD_CIUDAD     ,  COD_BARRIO     ,
        COD_IDENT      , } = req.body;

  let content = [{ TIPO_SOCIEDAD   , COD_SECTOR     ,  COD_PAIS     ,
                   COD_PROVINCIA   , COD_CIUDAD     ,  COD_BARRIO   ,
                   COD_IDENT       ,}];

  let in_params = content.map( item => { return _.keys(item) });  
  var valida = [{
  campo     : 'TIPO_SOCIEDAD',
  paquete   : 'EDS_BSPERSON',
  funcion   : 'POST_QUERY_CABECERA',
  in_params : in_params[0] ,
  out_params: [ 'DESC_TIPO_SOCIEDAD'
              , 'DESC_SECTOR'  
              , 'DESC_PAIS'  
              , 'DESC_PROVINCIA'
              , 'DESC_CIUDAD'
              , 'DESC_BARRIO'
              , 'DESC_IDENT'
            ]
  }];
  try {
    var response = await validateProcedure(content, valida, req);
    res.status(200).json(response.outBinds); 
  } catch (error) {
    next()
    log_error.error(`[EDS_BSPERSON] list POSTQUERY CAB: ${error}`)
  }
}