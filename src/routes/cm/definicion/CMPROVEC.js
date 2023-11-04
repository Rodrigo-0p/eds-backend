const express = require('express');
const router  = express.Router();

// LIST      
const lcab            =  require('../../../controller/modules/cm/definicion/CMPROVEC/listar/listCab'              );

// BUSCADORES 
const bpersona        = require('../../../controller/modules/cm/definicion/CMPROVEC/buscador/getPersona'          );
const bproveedor      = require('../../../controller/modules/cm/definicion/CMPROVEC/buscador/getProveedorRef'     );
const bcuentaContable = require('../../../controller/modules/cm/definicion/CMPROVEC/buscador/getCuentContable'    );
const bcuentaCont     = require('../../../controller/modules/cm/definicion/CMPROVEC/buscador/getCuentCont'        );
const bbanco          = require('../../../controller/modules/cm/definicion/CMPROVEC/buscador/getBanco'            );
const bcodCompras     = require('../../../controller/modules/cm/definicion/CMPROVEC/buscador/getCondCompra'       );
const bcodMonedas     = require('../../../controller/modules/cm/definicion/CMPROVEC/buscador/getMoneda'           );
const bModificaDiaAnt = require('../../../controller/modules/cm/definicion/CMPROVEC/buscador/getModificaDiasAnt'  );

// VALIDADORES
const vpersona        = require('../../../controller/modules/cm/definicion/CMPROVEC/validador/validaPersona'      );
const vproveedor      = require('../../../controller/modules/cm/definicion/CMPROVEC/validador/validaProveedor'    );
const vcuentaContable = require('../../../controller/modules/cm/definicion/CMPROVEC/validador/validaCuentContable');
const vcuentaCont     = require('../../../controller/modules/cm/definicion/CMPROVEC/validador/validaCuentCont'    );
const vbanco          = require('../../../controller/modules/cm/definicion/CMPROVEC/validador/validaBanco'        );
const vcodCompra      = require('../../../controller/modules/cm/definicion/CMPROVEC/validador/validaCodCompra'    );
const vcodMoneda      = require('../../../controller/modules/cm/definicion/CMPROVEC/validador/validaMoneda'       );
const vlimitRendicion = require('../../../controller/modules/cm/definicion/CMPROVEC/validador/validalimiteDias'   );

// Main
const main            = require('../../../controller/modules/cm/definicion/CMPROVEC/main');

module.exports = function(){
  // main
  router.get('/cm/cmprovec/cod_proveedor/:cod_empresa',main.get_cod_persona );
  router.post('/cm/cmprovec'                         , main.abm              );
  // LISTAR 
  router.post('/cm/cmprovec/list/proveedor'         , lcab.main             );  
  // Buscadores
  router.post('/cm/cmprovec/buscar/modificaDiaAnt'  , bModificaDiaAnt.main  );
  router.post('/cm/cmprovec/buscar/persona'         , bpersona.main         );
  router.post('/cm/cmprovec/buscar/proveedorRef'    , bproveedor.main       );
  router.post('/cm/cmprovec/buscar/cuentaContable'  , bcuentaContable.main  );
  router.post('/cm/cmprovec/buscar/cuentaCont'      , bcuentaCont.main      );
  router.post('/cm/cmprovec/buscar/banco'           , bbanco.main           );
  router.post('/cm/cmprovec/buscar/codCompra'       , bcodCompras.main      );
  router.post('/cm/cmprovec/buscar/moneda'          , bcodMonedas.main      );
  // Validadores
  router.post('/cm/cmprovec/valida/persona'         , vpersona.main         );
  router.post('/cm/cmprovec/valida/proveedorRef'    , vproveedor.main       );
  router.post('/cm/cmprovec/valida/cuentaContable'  , vcuentaContable.main  );
  router.post('/cm/cmprovec/valida/cuentaCont'      , vcuentaCont.main      );
  router.post('/cm/cmprovec/valida/banco'           , vbanco.main           );
  router.post('/cm/cmprovec/valida/codCompra'       , vcodCompra.main       );
  router.post('/cm/cmprovec/valida/moneda'          , vcodMoneda.main       );
  router.post('/cm/cmprovec/valida/limiteRendicion' , vlimitRendicion.main  );
 
  return router;
}