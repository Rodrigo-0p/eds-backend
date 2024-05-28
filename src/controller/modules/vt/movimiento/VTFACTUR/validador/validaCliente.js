const { validateBooleanFunction } = require('../../../../../../utils/validate');
const {log_error}                 = require('../../../../../../utils/logger');
const _                           = require('underscore')
const moment = require('moment');
exports.main = async (req, res, next)  => {
  const {COD_EMPRESA }	= req.body;
  let FEC_COMPROBANTE =  moment(req.body.FEC_COMPROBANTE.slice(0,10)).format('DD/MM/YYYY'); 
  const COD_CLIENTE   = req.body.valor ? req.body.valor : ''
  
  FEC_COMPROBANTE = null;
  let content 	= [{COD_EMPRESA,FEC_COMPROBANTE,COD_CLIENTE}];

  // console.log( content );
  // console.log( req.body.FEC_COMPROBANTE.slice(0,10) );

  let in_params = content.map( item => { return _.keys(item) });
  var valida 	  = [{
    campo	      : 'COD_CLIENTE',
    paquete		  : 'EDS_VTFACTUR.',
    funcion		  : 'VALIDA_CLIENTE',			
    in_params   : in_params[0],
    out_params  : ['NOM_CLIENTE','DIR_CLIENTE','RUC','TEL_CLIENTE','DIAS_INICIAL','LIMITE_CREDITO','SIGLAS','SALDO','COD_ZONA','IND_SUBCLI'],
  }];
  try {
    var response = await validateBooleanFunction(content, valida, req);	
    res.status(200).json(response.data);
  } catch (error) {
    log_error.error(`EDS_VTFACTUR: VALIDA_CLIENTE : ${error} `);
    console.error('EDS_VTFACTUR: VALIDA_CLIENTE   : ',error);
    next()
  }
}