const { validateBooleanFunction } = require('../../../../../../utils/validate');
const {log_error}           	    = require('../../../../../../utils/logger');
const _                           = require('underscore')

exports.main = async (req, res, next)  => {

  const {COD_EMPRESA = '', NRO_COMPROBANTE = '',  TIP_COMPROBANTE  = '',  SER_COMPROBANTE  = '', ESTADO_CORREO = ''} = req.body
	
  let content 	 = [{COD_EMPRESA,TIP_COMPROBANTE,SER_COMPROBANTE,NRO_COMPROBANTE,ESTADO_CORREO}];
  let in_params  = content.map( item => { return _.keys(item) });  
  
  var valida 		 = [{
			campo			 : 'ESTADO_CORREO'         ,
			paquete		 : 'EDS_VTPRESAR.'  ,
			funcion		 : 'VALIDA_ESTADO_CORREO',
			in_params  : in_params[0]     ,
      in_type    : {'NRO_DOCUMENTO' : 'NUMBER'},
      bind_type  : {'ESTADO_CORREO' : 'INOUT' },
      out_params : [],
		}];
	try {
		var response = await validateBooleanFunction(content, valida, req);	
    res.status(200).json(response.data);
	} catch (error) {
		log_error.error(`EDS_VTPRESAR: VALIDA_ESTADO_CORREO : ${error} `);;
		console.error('EDS_VTPRESAR: VALIDA_ESTADO_CORREO   : ',error)
		next()
	}
}