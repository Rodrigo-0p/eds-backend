const { validateBooleanFunction } = require('../../../../../../utils/validate');
const {log_error}                 = require('../../../../../../utils/logger');
const _                           = require('underscore');
const DefinePrecio                = require('./validaDefinePrecio');
exports.main = async (req, res, next, band = false )  => {
  let dependencia = _.extend( ...req.body.dependencia);
  let COD_EMPRESA	      = req.body.cod_empresa;
  let IND_VARIAS_UM     = 'N';
  let COD_ARTICULO	    = dependencia.COD_ARTICULO;
  let COD_UNIDAD_MEDIDA = req.body.valor ? req.body.valor : ''
  let content 	        = [{COD_EMPRESA,IND_VARIAS_UM, COD_ARTICULO,COD_UNIDAD_MEDIDA}];
  let in_params         = content.map( item => { return _.keys(item) });
  var valida 		 = [{
    campo			 : 'COD_UNIDAD_MEDIDA',
    paquete		 : 'EDS_VTFACTUR.',
    funcion		 : 'VALIDA_UM',			
    in_params  : in_params[0],
    out_params : ['DESC_UNIDAD_MEDIDA','DESC_ARTICULO','MULT','DIV','PORC_VTA'], 
  }];
  try {
    var response = await validateBooleanFunction(content, valida, req);
    if( response.data.outBinds.ret === 1){
      req.body.dependencia = [ ...req.body.dependencia, { 
        COD_UNIDAD_MEDIDA: COD_UNIDAD_MEDIDA,
        MULT: response.data.outBinds.MULT, 
        DIV: response.data.outBinds.DIV, 
      }];
      req.body.valor = '';
      let outs = await DefinePrecio.main( req, res, next, true );
      response.data.outBinds = { ...response.data.outBinds, ...outs.outBinds };
    }
    if(band) return response.data; 
    else res.status(200).json(response.data);
  } catch (error) {
    log_error.error(`EDS_VTFACTUR: VALIDA_UM : ${error} `);
    console.error('EDS_VTFACTUR: VALIDA_UM   : ',error);
    next()
  }
}