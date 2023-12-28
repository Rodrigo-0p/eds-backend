const express = require('express');
const router  = express.Router();

// BUSCADORES
const bpersona        = require('../../../controller/modules/vt/definicion/VTVENDE/buscador/getPersona'          );
// VALIDADORES
const vpersona        = require('../../../controller/modules/vt/definicion/VTVENDE/validador/validaPersona'      );
// LIST      
const lcab            = require('../../../controller/modules/vt/definicion/VTVENDE/listar/listCab'               );
// Main
const main            = require('../../../controller/modules/vt/definicion/VTVENDE/main');

module.exports = function(){
  
  router.get('/vt/vtvende/cod_vendedor/:cod_empresa'   , main.get_cod_vendedor );
  // ABM
  router.post('/vt/vtvende'                            , main.main);
  // BUSCADORES
  router.post('/vt/vtvende/buscar/persona'             , bpersona.main   );  
  // VALIDADORES
  router.post('/vt/vtvende/valida/persona'             , vpersona.main   );  
  // LISTAR 
  router.post('/vt/vtvende/list/listCab'               , lcab.main       );  
  return router;
}