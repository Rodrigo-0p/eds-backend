const express = require('express');
const router  = express.Router();

// BUSCADORES
const bmoneda      = require('../../../controller/modules/vt/definicion/VTLISPRE/buscador/getMoneda'      );
const barticulo    = require('../../../controller/modules/vt/definicion/VTLISPRE/buscador/getArticulo'    );
const bum          = require('../../../controller/modules/vt/definicion/VTLISPRE/buscador/getUm'          );
// VALIDADORES
const vmoneda      = require('../../../controller/modules/vt/definicion/VTLISPRE/validador/validaMoneda'  );
const varticulo    = require('../../../controller/modules/vt/definicion/VTLISPRE/validador/validaArticulo');
const vum          = require('../../../controller/modules/vt/definicion/VTLISPRE/validador/validaUm'      );
// LIST      
const lcab         = require('../../../controller/modules/vt/definicion/VTLISPRE/listar/listCab'          );
const pqcab        = require('../../../controller/modules/vt/definicion/VTLISPRE/listar/postQuery'        );
const ldet         = require('../../../controller/modules/vt/definicion/VTLISPRE/listar/listDet'          );
// Main
const main         = require('../../../controller/modules/vt/definicion/VTLISPRE/main');

module.exports = function(){
  
  router.get('/vt/vtlispre/cod_lispre/:cod_empresa/:cod_sucursal'   , main.get_cod_list_pre );
  // ABM
  router.post('/vt/vtlispre'                    , main.main);
  // BUSCADORES
  router.post('/vt/vtlispre/buscar/moneda'      , bmoneda.main   );  
  router.post('/vt/vtlispre/buscar/articulo'    , barticulo.main );
  router.post('/vt/vtlispre/buscar/um'          , bum.main       );
  // VALIDADORES
  router.post('/vt/vtlispre/valida/moneda'      , vmoneda.main   );  
  router.post('/vt/vtlispre/valida/articulo'    , varticulo.main );  
  router.post('/vt/vtlispre/valida/um'          , vum.main       );  
  // LISTAR 
  router.post('/vt/vtlispre/listCab'            , lcab.main      );  
  router.post('/vt/vtlispre/postqueryCab'       , pqcab.main     );
  router.post('/vt/vtlispre/listDet'            , ldet.main      );    
  return router;
}