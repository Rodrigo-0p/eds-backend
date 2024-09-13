const { validateBooleanFunction } = require('../../../../../../../utils/validate');
const {log_error}                 = require('../../../../../../../utils/logger');
const _                           = require('underscore')

exports.main = async (req, res, next)  => {

const {COD_EMPRESA = '',FEC_COMPROBANTE = '', CLIENTE_OCA = ''}	 = req.body;
let COD_CLIENTE = req.body.valor ? req.body.valor : ''
let content 	 = [{COD_EMPRESA,COD_CLIENTE,FEC_COMPROBANTE,CLIENTE_OCA}];
let in_params  = content.map( item => { return _.keys(item) });  
var valida 		 = [{
    campo			 : 'COD_CLIENTE'   ,
    paquete		 : 'EDS_CCNCRDEF.'  ,
    funcion		 : 'VALIDA_CLIENTE',			
    in_params  : in_params[0],
    out_params : [ 'DESC_CLIENTE'
                 , 'CLIENTE_PERSONA'
                 , 'RUC'
                 , 'TEL_CLIENTE'
                 , 'COD_CONDICION_VENTA' 
                 , 'DIAS_INICIAL'
                 , 'LIMITE_CREDITO'
                 , 'SIGLAS'
                 , 'SALDOS'
                 , 'COD_ZONA'
                 , 'IND_SUBCLI'
                 , 'COD_SUBCLIENTE'
                 , 'NOM_SUBCLIENTE'
                 , 'DIR_CLIENTE'
                 , 'CI'],
  }];
  try {
    var response = await validateBooleanFunction(content, valida, req);
    res.status(200).json(response.data);
  } catch (error) {
    log_error.error(`EDS_CCNCRDEF: VALIDA_CLIENTE : ${error} `);;
    console.error('EDS_CCNCRDEF: VALIDA_CLIENTE   : ',error)
    next()
  }
}