const { validateBooleanFunction } = require('../../../../../../../utils/validate');
const {log_error}                 = require('../../../../../../../utils/logger');
const _                           = require('underscore')

exports.main = async (req, res, next)  => {
const {TIP_DOCUMENTO = ''} = req.body
let SER_DOCUMENTO = req.body.valor ? req.body.valor : '';
let content 	 = [{TIP_DOCUMENTO,SER_DOCUMENTO}];
console.log(content)
let in_params  = content.map( item => { return _.keys(item) });  
var valida 		 = [{
    campo			 : 'TIP_DOCUMENTO'   ,
    paquete		 : 'EDS_CCMOVCAJ.'   ,
    funcion		 : 'UP_SER_DOCUMENTO',
    in_params  : in_params[0]      ,
    out_params : []                ,
  }];
  try {
    var response = await validateBooleanFunction(content, valida, req);
    res.status(200).json(response.data.outBinds ? response.data.outBinds : response);
  } catch (error) {
    log_error.error(`EDS_CCMOVCAJ: UP_SER_DOCUMENTO : ${error}`);
    console.error('EDS_CCMOVCAJ: UP_SER_DOCUMENTO   : ',error)
    next()
  }
  
}