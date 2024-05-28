const { validateBooleanFunction } = require('../../../../../../utils/validate'); 
const {log_error}           = require('../../../../../../utils/logger');
const _                     = require('underscore')
exports.main = async (req, res, next)  => {
  const { COD_EMPRESA, NOM_FORMA  } = req.body; 
  let content = [{COD_EMPRESA, NOM_FORMA}];
  var valida 	= [{
		campo			: 'NOM_FORMA',
		paquete		: 'EDS_VTPEDIDO.',
		funcion		: 'PRE_FORM',
		in_params	: ['COD_EMPRESA','NOM_FORMA'],
		out_params: [
			'TIPO_PEDIDO',
			'SER_COMPROBANTE',
			'COD_MONEDA_BASE',
			'COD_MONEDA_DOL',
			'LOTE_DFLT',
			'VENC_LOTE_DFLT',
			'LINEAS_MAX',
			'CLIENTE_OCACIONAL',
			'PERMITE_ANULAR',
			'CARGA_SUCURSAL',
			'CARGA_FECHA',
			'CARGA_PRECIOS',
			'CARGA_CONCICION',
			'DESC_FINANCIERO',
			'DESC_VARIOS',
			'LIMITE_DIAS'
		],
	}];
	try {
		var response = await validateBooleanFunction(content, valida, req);
  	res.status(200).json(response.data.outBinds);
	} catch (error) {
    log_error.error(`EDS_VTPEDIDO: PRE_FORM ${ error }`);
		console.error('EDS_VTPEDIDO: PRE_FORM', error)
		next();
	}
}