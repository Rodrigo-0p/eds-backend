const { validateBooleanFunction } = require('../../../../../../../utils/validate');
const {log_error}                 = require('../../../../../../../utils/logger');
const _                           = require('underscore')

exports.main = async (req, res, next)  => {

const {COD_EMPRESA = ''} = req.body;
let COD_MOTIVO_NCR       = req.body.valor ? req.body.valor : ''
let content 	 = [{ COD_EMPRESA, COD_MOTIVO_NCR}];
let in_params  = content.map( item => { return _.keys(item) });  
var valida 		 = [{
    campo			 : 'COD_EMPRESA'        ,
    paquete		 : 'EDS_CCNCRDEF.'      ,
    funcion		 : 'VALIDA_MOTIVO_NCR'  ,
    in_params  : in_params[0]         ,
    out_params : ['DESC_MOTIVO_NCR'
                 ,'AFECT_STOCK'
                 ,'CARGA_REF'],
   }];
  try {
    var response = await validateBooleanFunction(content, valida, req);
    res.status(200).json(response.data);
  } catch (error) {
    log_error.error(`EDS_CCNCRDEF: VALIDA_MOTIVO_NCR : ${error}`);
    console.error('EDS_CCNCRDEF: VALIDA_MOTIVO_NCR   : ',error)
    next()
  }
  
}