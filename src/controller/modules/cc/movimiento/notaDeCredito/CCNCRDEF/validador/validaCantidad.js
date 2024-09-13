const { validateBooleanFunction } = require('../../../../../../../utils/validate');
const {log_error}                 = require('../../../../../../../utils/logger');
const _                           = require('underscore')

exports.main = async (req, res, next)  => {
let dependencia  =  _.extend( ...req.body.dependencia );
let CANTIDAD     = req.body.valor;
let MULT         = dependencia ? dependencia.MULT : ''
let DIV          = dependencia ? dependencia.DIV : ''

let content 	 = [{CANTIDAD,MULT,DIV}];
let in_params  = content.map( item => { return _.keys(item) });  
var valida 		 = [{
    campo			 : 'CANTIDAD'     ,
    paquete		 : 'EDS_CCNCRDEF.',
    funcion		 : 'UP_CANTIDAD'  ,
    in_params  : in_params[0]   ,
    out_params : ['CANTIDAD_UB'],
    out_type   : { CANTIDAD_UB:'NUMBER'}
  }];
  try {
    var response = await validateBooleanFunction(content, valida, req);
    res.status(200).json(response.data);
  } catch (error) {
    log_error.error(`EDS_CCNCRDEF: UP_CANTIDAD : ${error} `);;
    console.error('EDS_CCNCRDEF: UP_CANTIDAD   : ',error)
    next()
  }
}