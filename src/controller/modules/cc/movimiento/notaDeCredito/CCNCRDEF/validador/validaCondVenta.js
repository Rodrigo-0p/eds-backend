const { validateBooleanFunction } = require('../../../../../../../utils/validate');
const {log_error}                 = require('../../../../../../../utils/logger');
const _                           = require('underscore')

exports.main = async (req, res, next)  => {

const {COD_EMPRESA = '',TIP_COMPROBANTE_REF = ''}	 = req.body;
let COD_CONDICION_VENTA = req.body.valor ? req.body.valor : ''
let content 	 = [{ COD_EMPRESA, COD_CONDICION_VENTA, TIP_COMPROBANTE_REF}];
let in_params  = content.map( item => { return _.keys(item) });  
var valida 		 = [{
    campo			 : 'COD_EMPRESA'      ,
    paquete		 : 'EDS_CCNCRDEF.'    ,
    funcion		 : 'VALIDA_COND_VENTA',
    in_params  : in_params[0],
    out_params : ['DESC_CONDICION','DIAS_INICIAL','TIPO'],
   }];
  try {
    var response = await validateBooleanFunction(content, valida, req);
    res.status(200).json(response.data);
  } catch (error) {
    log_error.error(`EDS_CCNCRDEF: VALIDA_COND_VENTA : ${error}`);
    console.error('EDS_CCNCRDEF: VALIDA_COND_VENTA   : ',error)
    next()
  }
}