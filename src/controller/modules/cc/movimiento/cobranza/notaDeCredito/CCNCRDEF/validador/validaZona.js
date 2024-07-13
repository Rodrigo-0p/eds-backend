const { validateBooleanFunction } = require('../../../../../../../../utils/validate');
const {log_error}                 = require('../../../../../../../../utils/logger');
const _                           = require('underscore')

exports.main = async (req, res, next)  => {

const {COD_EMPRESA = '', COD_CLIENTE = '', COD_SUBCLIENTE = '',CLIENTE_OCA = ''}	 = req.body;
let COD_ZONA = req.body.valor ? req.body.valor : ''
let content 	 = [{COD_EMPRESA,COD_CLIENTE, COD_SUBCLIENTE, COD_ZONA, CLIENTE_OCA}];
let in_params  = content.map( item => { return _.keys(item) });  
var valida 		 = [{
    campo			 : 'COD_SUCURSAL'   ,
    paquete		 : 'EDS_CCNCRDEF.'  ,
    funcion		 : 'VALIDA_ZONA',			
    in_params  : in_params[0],
    out_params : ['DESC_ZONA'],
  }];
  try {
    var response = await validateBooleanFunction(content, valida, req);	    
    res.status(200).json(response.data);
  } catch (error) {
    log_error.error(`EDS_CCNCRDEF: VALIDA_ZONA : ${error} `);;
    console.error('EDS_CCNCRDEF: VALIDA_ZONA   : ',error)
    next()
  }
}