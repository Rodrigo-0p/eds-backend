const express = require('express');
const router  = express.Router();

// BUSCADORES
const bpersona        = require('../../../controller/modules/vt/definicion/VTCLIENT/buscador/getPersona'          );
const bcondVen        = require('../../../controller/modules/vt/definicion/VTCLIENT/buscador/getCondVent'         );
const bcausal         = require('../../../controller/modules/vt/definicion/VTCLIENT/buscador/getCausal'           );
const bgrclie         = require('../../../controller/modules/vt/definicion/VTCLIENT/buscador/getGrupoCliente'     );
const bmonedas        = require('../../../controller/modules/vt/definicion/VTCLIENT/buscador/getMonedas'          );
const blistaPrec      = require('../../../controller/modules/vt/definicion/VTCLIENT/buscador/getListaPrecio'      );
const bpais           = require('../../../controller/modules/vt/definicion/VTCLIENT/buscador/getPais'             );
const bprovincia      = require('../../../controller/modules/vt/definicion/VTCLIENT/buscador/getProvincia'        );
const bciudad         = require('../../../controller/modules/vt/definicion/VTCLIENT/buscador/getCiudad'           );

// VALIDADORES
const vpersona        = require('../../../controller/modules/vt/definicion/VTCLIENT/validador/validaPersona'      );
const vcondVen        = require('../../../controller/modules/vt/definicion/VTCLIENT/validador/validaCondVent'     );
const vcausal         = require('../../../controller/modules/vt/definicion/VTCLIENT/validador/validaCausal'       );
const vgrclie         = require('../../../controller/modules/vt/definicion/VTCLIENT/validador/validaGrupoCliente' );
const vmonedas        = require('../../../controller/modules/vt/definicion/VTCLIENT/validador/validaMoneda'       );
const vlistaPrec      = require('../../../controller/modules/vt/definicion/VTCLIENT/validador/validaListaDePrecio');
const vpais           = require('../../../controller/modules/vt/definicion/VTCLIENT/validador/validaPais'         );
const vprovincia      = require('../../../controller/modules/vt/definicion/VTCLIENT/validador/validaProvincia'    );
const vciudad         = require('../../../controller/modules/vt/definicion/VTCLIENT/validador/validaCiudad'       );

// LIST      
const ldet            = require('../../../controller/modules/vt/definicion/VTCLIENT/listar/listDet'              );
const lcab            = require('../../../controller/modules/vt/definicion/VTCLIENT/listar/listCab'              );
const pqCab           = require('../../../controller/modules/vt/definicion/VTCLIENT/listar/postQuery'            );
const pqPreF          = require('../../../controller/modules/vt/definicion/VTCLIENT/listar/listPreForm'          );
// Main
const main            = require('../../../controller/modules/vt/definicion/VTCLIENT/main');

module.exports = function(){
  
  router.get('/vt/vtclient/buscar/cod_cliente/:cod_empresa'             , main.get_cod_cliente );
  router.get('/vt/vtclient/buscar/sub_cliente/:cod_empresa/:cod_cliente', main.get_sub_cliente );
  // ABM
  router.post('/vt/vtclient'                                            , main.main);
  // BUSCADORES
  router.post('/vt/vtclient/buscar/persona'   , bpersona.main   );  
  router.post('/vt/vtclient/buscar/condVen'   , bcondVen.main   );  
  router.post('/vt/vtclient/buscar/causal'    , bcausal.main    );  
  router.post('/vt/vtclient/buscar/grclient'  , bgrclie.main    );
  router.post('/vt/vtclient/buscar/monedas'   , bmonedas.main   );
  router.post('/vt/vtclient/buscar/listprec'  , blistaPrec.main );
  router.post('/vt/vtclient/buscar/pais'      , bpais.main      );
  router.post('/vt/vtclient/buscar/provincia' , bprovincia.main );
  router.post('/vt/vtclient/buscar/ciudad'    , bciudad.main    );
  // VALIDADORES
  router.post('/vt/vtclient/valida/persona'   , vpersona.main   );  
  router.post('/vt/vtclient/valida/condVen'   , vcondVen.main   );  
  router.post('/vt/vtclient/valida/causal'    , vcausal.main    );  
  router.post('/vt/vtclient/valida/grclient'  , vgrclie.main    );
  router.post('/vt/vtclient/valida/listprec'  , vlistaPrec.main );  
  router.post('/vt/vtclient/valida/monedas'   , vmonedas.main   );  
  router.post('/vt/vtclient/valida/pais'      , vpais.main      );  
  router.post('/vt/vtclient/valida/provincia' , vprovincia.main );  
  router.post('/vt/vtclient/valida/ciudad'    , vciudad.main    );  
  // LISTAR 
  router.post('/vt/vtclient/listCab'          , lcab.main       );  
  router.post('/vt/vtclient/listDet'          , ldet.main       );    
  router.post('/vt/vtclient/postqueryCab'     , pqCab.main      );
  router.post('/vt/vtclient/preform'          , pqPreF.main     );
 
  return router;
}