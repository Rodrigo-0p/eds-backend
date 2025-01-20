const { validateBooleanFunction } = require('../../../../../../utils/validate');
const {log_error}                 = require('../../../../../../utils/logger');
const _                           = require('underscore');
const UnidadMedida                = require('./validaUnidadMedida');
exports.main = async (req, res, next)  => {
  let dependencia      = _.extend( ...req.body.dependencia);
  let COD_EMPRESA	     = req.body.cod_empresa;
  let COD_SUCURSAL     = dependencia.COD_SUCURSAL;
  let COD_CLIENTE      = dependencia.COD_CLIENTE;
  let COD_SUBCLIENTE   = dependencia.COD_SUBCLIENTE;
  let TIP_CLIENTE      = '';//dependencia.TIP_CLIENTE;
  let IND_REG_TURISMO  = dependencia.IND_REG_TURISMO;
  let IND_VENTA        = dependencia.IND_VENTA;
  let IND_COND_VTA     = dependencia.IND_COND_VTA;
  let COD_LISTA_PRECIO = dependencia.COD_LISTA_PRECIO;
  let COD_GRUP_VEND    = dependencia.COD_GRUP_VEND;
  let COD_ARTICULO     = req.body.valor ? req.body.valor : ''; 
  let content 	       = [{ 
    COD_EMPRESA, 
    COD_SUCURSAL, 
    COD_CLIENTE, 
    COD_SUBCLIENTE, 
    TIP_CLIENTE, 
    IND_REG_TURISMO, 
    IND_VENTA, 
    IND_COND_VTA, 
    COD_LISTA_PRECIO, 
    COD_GRUP_VEND, 
    COD_ARTICULO 
  }];
  let in_params        = content.map( item => { return _.keys(item) }); 
  var valida 		 = [{
    campo			 : 'COD_ARTICULO',
    paquete		 : 'EDS_VTPEDIDO.',
    funcion		 : 'valida_articulos',			
    in_params  : in_params[0],
    out_params : [
      'DESC_ARTICULO',
      'COD_UNIDAD_MEDIDA',
      'COD_IVA',
      'PORC_IVA', 
      'PORC_GRAVADA',
      'COSTO_PROMEDIO',
      'COSTO_ULTIMO',
      'IND_MANEJA_STOCK',
      'MULT',
      'DIV',
      'IND_REG_TURISMO',
      'NRO_LOTE',
      'FEC_VENCIMIENTO',
      'IND_OTROS',
      'IND_BLOQUEADO_X_INGRESO'
    ],
    out_type: {
      COD_IVA: 'NUMBER',
      PORC_IVA: 'NUMBER',
      PORC_GRAVADA: 'NUMBER',
      COSTO_PROMEDIO: 'NUMBER',
      COSTO_ULTIMO: 'NUMBER',
      MULT: 'NUMBER',
      DIV: 'NUMBER',
    },
    bind_type: {COD_ARTICULO:'INOUT'}
  }];
  try {
    var response = await validateBooleanFunction(content, valida, req);  
    if( response.data.outBinds.ret === 1 ){
      req.body.dependencia = [ ...req.body.dependencia, { COD_ARTICULO: response.data.outBinds.COD_ARTICULO}, {PORC_IVA: response.data.outBinds.PORC_IVA},{PORC_GRAVADA: response.data.outBinds.PORC_GRAVADA}]
      req.body.valor = response.data.outBinds.COD_UNIDAD_MEDIDA;
      let outs = await UnidadMedida.main( req, res, next, true ); 
      response.data.outBinds = { ...response.data.outBinds, ...outs.outBinds };
    }
    res.status(200).json(response.data);
  } catch (error) {
    log_error.error(`EDS_VTPEDIDO: valida_articulos : ${error} `);
    console.error('EDS_VTPEDIDO: valida_articulos   : ',error);
    next()
  }
}