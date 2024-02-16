const { validateBooleanFunction } = require('../../../../../../utils/validate');
const {log_error}                 = require('../../../../../../utils/logger');
const _                           = require('underscore')
const moment                      = require('moment');

exports.main = async (req, res, next)  => {

let COD_EMPRESA	 = req.body.cod_empresa;
let COD_SUCURSAL = req.body.dependencia[0].COD_SUCURSAL;
let COD_ARTICULO = req.body.valor ? req.body.valor : ''

let content 	   = [{COD_EMPRESA,COD_SUCURSAL,COD_ARTICULO}];
let in_params    = content.map( item => { return _.keys(item) });  

var valida 		 = [{
    campo			 : 'COD_ARTICULO'  ,
    paquete		 : 'EDS_STENVIO.' ,
    funcion		 : 'VALIDA_ARTICULO',			
    in_params  : in_params[0],
    out_params : ['DESC_ARTICULO','COSTO_ULTIMO','COD_UNIDAD_MEDIDA','NRO_LOTE','FEC_VENCIMIENTO'],
    out_type   : {'COSTO_ULTIMO':'NUMBER','FEC_VENCIMIENTO':'DATE'}
  }];
  try {
    var response = await validateBooleanFunction(content, valida, req);	    
    if(!response.valor){
      response.data.outBinds.FEC_VENCIMIENTO = response.data.outBinds.FEC_VENCIMIENTO ? moment.utc(response.data.outBinds.FEC_VENCIMIENTO).format('DD/MM/YYYY') : ''
      res.status(200).json(response.data);
    }else{
      res.status(200).json(response.data);
    }
  } catch (error) {
    log_error.error(`EDS_STENVIO: VALIDA_ARTICULO : ${error} `);;
    console.error('EDS_STENVIO: VALIDA_ARTICULO   : ',error)
    next()
  }
}