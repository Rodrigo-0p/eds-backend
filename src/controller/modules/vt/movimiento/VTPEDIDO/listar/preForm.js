const { validateProcedure } = require('../../../../../../utils/validate'); 
const {log_error}           = require('../../../../../../utils/logger');
const _                     = require('underscore')
exports.main = async (req, res, next)  => {
  const { COD_EMPRESA, NOM_FORMA  } = req.body; 
  let content = [{COD_EMPRESA, NOM_FORMA}];
	let in_params = content.map( item => { return _.keys(item) });  
  var valida 	= [{
		campo			: 'COD_EMPRESA'	,
		paquete		: 'EDS_VTPEDIDO',
		funcion		: 'PRE_FORM'		,
		in_params	: in_params[0] ,
		out_params: [ 'TIPO_PEDIDO'				,
									'SER_COMPROBANTE'		,
									'COD_MONEDA_BASE'		,
									'COD_MONEDA_DOL'		,
									'LOTE_DFLT'					,
									'VENC_LOTE_DFLT'		,
									'LINEAS_MAX'				,
									'CLIENTE_OCACIONAL'	,
									'PERMITE_ANULAR'		,
									'CARGA_SUCURSAL'		,
									'CARGA_FECHA'				,
									'CARGA_PRECIOS'			,
									'CARGA_CONCICION'		,
									'DESC_FINANCIERO'		,
									'DESC_VARIOS'				,
									'LIMITE_DIAS'
								],
	}];
try {
		var response = await validateProcedure(content, valida, req);
		res.status(200).json(response.outBinds);
	} catch (error) {
    log_error.error(`EDS_VTPEDIDO: PRE_FORM ${ error }`);
		console.error('EDS_VTPEDIDO: PRE_FORM', error)
		next();
	}
}