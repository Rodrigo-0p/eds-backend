const { validateBooleanFunction } = require('../../../../../../utils/validate');
const {log_error}           	    = require('../../../../../../utils/logger');
const _                           = require('underscore')

exports.main = async (req, res, next)  => {

  const COD_EMPRESA  		    = req.body.cod_empresa
	const COD_LISTA_DE_PRECIO = req.body.valor ? req.body.valor : ''
  let content 	 = [{COD_EMPRESA,COD_LISTA_DE_PRECIO}];
  let in_params  = content.map( item => { return _.keys(item) });  
  
  var valida 		 = [{
			campo			 : 'COD_MONEDA_LIMITE'     		 ,
			paquete		 : 'EDS_VTCLIENT.'         		 ,
			funcion		 : 'VALIDA_LISTA_DE_PRECIO'  	 ,
			in_params  : in_params[0]            		 ,
      out_params : ['DESC_LISTA_PRECIO']  		 ,
		}];
	try {
		var response = await validateBooleanFunction(content, valida, req);	
    res.status(200).json(response.data);
	} catch (error) {
		log_error.error(`EDS_VTCLIENT: VALIDA_LISTA_DE_PRECIO : ${error} `);;
		console.error('EDS_VTCLIENT: VALIDA_LISTA_DE_PRECIO   : ',error)
		next()
	}
}