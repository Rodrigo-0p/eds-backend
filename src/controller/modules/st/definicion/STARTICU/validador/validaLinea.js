  const { validateBooleanFunction } = require('../../../../../../utils/validate');
  const {log_error}                 = require('../../../../../../utils/logger');
  const _                           = require('underscore')

  exports.main = async (req, res, next)  => {

  const {COD_EMPRESA,COD_MARCA}	 = req.body;
  console.log(req.body);
  const COD_LINEA      = req.body.valor ? req.body.valor : ''

  let content 	 = [{COD_EMPRESA,COD_MARCA,COD_LINEA}];
  let in_params  = content.map( item => { return _.keys(item) });  

  var valida 		 = [{
      campo			 : 'COD_LINEA'     ,
      paquete		 : 'EDS_STARTICU.' ,
      funcion		 : 'valida_linea'  ,			
      in_params  : ['COD_EMPRESA','COD_MARCA','COD_LINEA'],
      out_params : ['DESC_LINEA']  ,
    }];
  try {
    var response = await validateBooleanFunction(content, valida, req);	
    res.status(200).json(response.data);
  } catch (error) {
    log_error.error(`EDS_STARTICU: VALIDA_LINEA : ${error} `);;
    console.error('EDS_STARTICU: VALIDA_LINEA   : ',error)
    next()
  }
}