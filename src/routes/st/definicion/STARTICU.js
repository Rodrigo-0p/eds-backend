const express = require('express');
const router  = express.Router();

// BUSCADORES
const bproveedor  = require('../../../controller/modules/st/definicion/STARTICU/buscador/getProveedor'      );
const bmarca      = require('../../../controller/modules/st/definicion/STARTICU/buscador/getMarca'          );
const brubro      = require('../../../controller/modules/st/definicion/STARTICU/buscador/getRubro'          );
const bgrupo      = require('../../../controller/modules/st/definicion/STARTICU/buscador/getGrupo'          );
const bIva        = require('../../../controller/modules/st/definicion/STARTICU/buscador/getIva'            );
const bUm         = require('../../../controller/modules/st/definicion/STARTICU/buscador/getUm'             );

// VALIDADORES
const vproveedor  = require('../../../controller/modules/st/definicion/STARTICU/validador/validaProveedor'  );
const vmarca      = require('../../../controller/modules/st/definicion/STARTICU/validador/validaMarca'      );
const vrubro      = require('../../../controller/modules/st/definicion/STARTICU/validador/validaRubro'      );
const vgrupo      = require('../../../controller/modules/st/definicion/STARTICU/validador/validaGrupo'      );
const vIva        = require('../../../controller/modules/st/definicion/STARTICU/validador/validaIva'        );
const vUm         = require('../../../controller/modules/st/definicion/STARTICU/validador/validaUm'         );

// LIST      
const lcab        = require('../../../controller/modules/st/definicion/STARTICU/listar/listCab'             );
const lrel        = require('../../../controller/modules/st/definicion/STARTICU/listar/listDet'             );
const pqCab       = require('../../../controller/modules/st/definicion/STARTICU/listar/postQuery'           );

// ABM
const main        = require('../../../controller/modules/st/definicion/STARTICU/main'                       );

module.exports = function(){
  // ABMu
  router.post('/st/starticu'                            , main.main             );
  router.get('/st/starticu/cod_articulo/:cod_empresa'   , main.get_cod_articulo );
  // LIST
  router.post('/st/starticu/list/articulo'    , lcab.main         );  
  router.post('/st/starticu/list/relaciones'  , lrel.main         );
  router.post('/st/starticu/list/postqueryCab', pqCab.main        );

  // BUSCADORES
  router.post('/st/starticu/buscar/proveedor' , bproveedor.main   );  
  router.post('/st/starticu/buscar/marca'     , bmarca.main       );  
  router.post('/st/starticu/buscar/rubro'     , brubro.main       );  
  router.post('/st/starticu/buscar/grupo'     , bgrupo.main       );  
  router.post('/st/starticu/buscar/iva'       , bIva.main         );  
  router.post('/st/starticu/buscar/um'        , bUm.main          );  

  // VALIDADORES
  router.post('/st/starticu/valida/proveedor' , vproveedor.main   );  
  router.post('/st/starticu/valida/marca'     , vmarca.main       );  
  router.post('/st/starticu/valida/rubro'     , vrubro.main       );  
  router.post('/st/starticu/valida/grupo'     , vgrupo.main       );  
  router.post('/st/starticu/valida/iva'       , vIva.main         );    
  router.post('/st/starticu/valida/um'        , vUm.main          );    
  
  return router;
}