const express = require('express');
const router = express.Router();
const base_url = '/vt/vtfactur/';
// BUSCADORES
const bsucursal        = require('../../../controller/modules/vt/movimiento/VTFACTUR/buscador/getSucursal' );
const bcliente         = require('../../../controller/modules/vt/movimiento/VTFACTUR/buscador/getCliente' );
const bsubcliente      = require('../../../controller/modules/vt/movimiento/VTFACTUR/buscador/getSubCliente' );
const bvendedor        = require('../../../controller/modules/vt/movimiento/VTFACTUR/buscador/getVendedor' );
const blista_precio    = require('../../../controller/modules/vt/movimiento/VTFACTUR/buscador/getListaPrecio' );
const bmoneda          = require('../../../controller/modules/vt/movimiento/VTFACTUR/buscador/getMoneda' );
const bcondicion_venta = require('../../../controller/modules/vt/movimiento/VTFACTUR/buscador/getCondicionVenta' );
const bdeposito        = require('../../../controller/modules/vt/movimiento/VTFACTUR/buscador/getDeposito' );
// ! DETALLE
const barticulo        = require('../../../controller/modules/vt/movimiento/VTFACTUR/buscador/getArticulo' );
const bunidad_medida   = require('../../../controller/modules/vt/movimiento/VTFACTUR/buscador/getUnidadMedida' );
// VALIDADORES
const vsucursal        = require('../../../controller/modules/vt/movimiento/VTFACTUR/validador/validaSucursal' );
const vcliente         = require('../../../controller/modules/vt/movimiento/VTFACTUR/validador/validaCliente' );
const vsubcliente      = require('../../../controller/modules/vt/movimiento/VTFACTUR/validador/validaSubCliente' );
const vvendedor        = require('../../../controller/modules/vt/movimiento/VTFACTUR/validador/validaVendedor' );
const vlista_precio    = require('../../../controller/modules/vt/movimiento/VTFACTUR/validador/validaListaPrecio' );
const vmoneda          = require('../../../controller/modules/vt/movimiento/VTFACTUR/validador/validaMoneda' );
const vcondicion_venta = require('../../../controller/modules/vt/movimiento/VTFACTUR/validador/validaCondicionVenta' );
const vdeposito        = require('../../../controller/modules/vt/movimiento/VTFACTUR/validador/validaDeposito' );
// ! DETALLE
const varticulo        = require('../../../controller/modules/vt/movimiento/VTFACTUR/validador/validaArticulo' );
const vunidad_medida   = require('../../../controller/modules/vt/movimiento/VTFACTUR/validador/validaUnidadMedida' );
const vcantidad        = require('../../../controller/modules/vt/movimiento/VTFACTUR/validador/validaCantidad' );
// LIST      
const lcabecera        = require('../../../controller/modules/vt/movimiento/VTFACTUR/listar/listCab');
const ldetalle         = require('../../../controller/modules/vt/movimiento/VTFACTUR/listar/listDet');
const pquery           = require('../../../controller/modules/vt/movimiento/VTFACTUR/listar/postQuery');
const preform          = require('../../../controller/modules/vt/movimiento/VTFACTUR/listar/preForm');
// ABM
const main           = require('../../../controller/modules/vt/movimiento/VTFACTUR/main'                        );
// REPORTE
// const rstenvio       = require('../../../controller/modules/vt/movimiento/VTFACTUR/reporte/RSTENVIO'            );

module.exports = function(){
  // ABM
  router.get( base_url + ':cod_empresa/:tip_comprobante/:ser_comprobante'                  , main.getNroComp );
  router.get( base_url + ':cod_empresa/:tip_comprobante/:ser_comprobante/:nro_comprobante' , main.getNrOrden );
  router.post('/vt/vtfactur'                     , main.main           );
  // LIST
  router.post( base_url + 'list/cabecera'         , lcabecera.main );
  router.post( base_url + 'list/detalle'          , ldetalle.main );
  router.post( base_url + 'list/post_query'       , pquery.main );
  router.post( base_url + 'pre_form'              , preform.main );
  // BUSCADORES  
  router.post( base_url + 'buscar/sucursal'       , bsucursal.main );
  router.post( base_url + 'buscar/cliente'        , bcliente.main );
  router.post( base_url + 'buscar/subcliente'     , bsubcliente.main );
  router.post( base_url + 'buscar/vendedor'       , bvendedor.main );
  router.post( base_url + 'buscar/lista_precio'   , blista_precio.main );
  router.post( base_url + 'buscar/moneda'         , bmoneda.main );
  router.post( base_url + 'buscar/condicion_venta', bcondicion_venta.main );
  router.post( base_url + 'buscar/deposito'       , bdeposito.main );
  router.post( base_url + 'buscar/articulo'       , barticulo.main );
  router.post( base_url + 'buscar/unidad_medida'  , bunidad_medida.main );
  // VALIDADORES
  router.post( base_url + 'valida/sucursal'       , vsucursal.main );
  router.post( base_url + 'valida/cliente'        , vcliente.main );
  router.post( base_url + 'valida/subcliente'     , vsubcliente.main );
  router.post( base_url + 'valida/vendedor'       , vvendedor.main );
  router.post( base_url + 'valida/lista_precio'   , vlista_precio.main ); 
  router.post( base_url + 'valida/moneda'         , vmoneda.main );
  router.post( base_url + 'valida/condicion_venta', vcondicion_venta.main );
  router.post( base_url + 'valida/deposito'       , vdeposito.main );
  router.post( base_url + 'valida/articulo'       , varticulo.main );
  router.post( base_url + 'valida/unidad_medida'  , vunidad_medida.main );
  router.post( base_url + 'valida/cantidad'       , vcantidad.main );
  // REPORTE
  // router.post( base_url + 'reporte/rstenvio'    , rstenvio.main       );
  return router;
}