  const { validateBooleanFunction } = require('../../../../../../utils/validate');
  const {log_error}                 = require('../../../../../../utils/logger');
  const _                           = require('underscore')

  exports.main = async (req, res, next)  => {

  const {COD_EMPRESA,COD_SUCURSAL}	 = req.body;
  const COD_MOTIVO   = req.body.valor ? req.body.valor : ''
  let content 	 = [{COD_EMPRESA,COD_SUCURSAL,COD_MOTIVO}];

  let in_params  = content.map( item => { return _.keys(item) });  

  var valida 		 = [{
      campo			 : 'COD_MOTIVO'  ,
      paquete		 : 'EDS_STENVIO.' ,
      funcion		 : 'VALIDA_MOTIVOS'  ,			
      in_params  : in_params[0],
      out_params : ['DESC_MOTIVO']  ,
    }];
  try {
    var response = await validateBooleanFunction(content, valida, req);	
    res.status(200).json(response.data);
  } catch (error) {
    log_error.error(`EDS_STENVIO: VALIDA_MOTIVOS : ${error} `);;
    console.error('EDS_STENVIO: VALIDA_MOTIVOS   : ',error)
    next()
  }
}