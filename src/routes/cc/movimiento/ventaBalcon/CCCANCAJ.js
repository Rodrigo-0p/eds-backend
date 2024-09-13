const express  = require('express');
const router   = express.Router();
const cccancaj = '/cc/cccancaj'

// list
const lcabecera     = require('../../../../controller/modules/cc/movimiento/ventaBalcon/CCCANCAJ/listar/listCab');
const lpreForm      = require('../../../../controller/modules/cc/movimiento/ventaBalcon/CCCANCAJ/listar/getPreForm');
// valida
const vIndAutoriza  = require('../../../../controller/modules/cc/movimiento/ventaBalcon/CCCANCAJ/validar/validaIndAutoriza');
const vIndRubicar   = require('../../../../controller/modules/cc/movimiento/ventaBalcon/CCCANCAJ/validar/validaIndRubicar');

module.exports = function(){

  // listar
  router.post(`${cccancaj}/list/cabecera`     , lcabecera.main    );
  router.post(`${cccancaj}/preForm`           , lpreForm.main     );
  
  // valida
  router.post(`${cccancaj}/valida/autorizar`  , vIndAutoriza.main );
  router.post(`${cccancaj}/valida/rubicar`    , vIndRubicar.main  );
  

  return router;
}