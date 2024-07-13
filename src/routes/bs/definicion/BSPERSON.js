const express = require('express');
const router  = express.Router();

// BUSCAR
const bPersona  = require('../../../controller/modules/bs/definicion/BSPERSON/buscador/getPersona'               );
const bTipoSoc  = require('../../../controller/modules/bs/definicion/BSPERSON/buscador/getTipoSociedad'          );
const bSector   = require('../../../controller/modules/bs/definicion/BSPERSON/buscador/getSector'                );
const bPais     = require('../../../controller/modules/bs/definicion/BSPERSON/buscador/getPais'                  );
const bDpto     = require('../../../controller/modules/bs/definicion/BSPERSON/buscador/getDepartamento'          );
const bCiudad   = require('../../../controller/modules/bs/definicion/BSPERSON/buscador/getCiudad'                );
const bBarrio   = require('../../../controller/modules/bs/definicion/BSPERSON/buscador/getBarrio'                );
const bTipIden  = require('../../../controller/modules/bs/definicion/BSPERSON/buscador/getTipoIdentificacion'    );
const bspersona = require('../../../controller/modules/bs/definicion/BSPERSON/main'                              );
// VALIDACION
const vTipoSoc  = require('../../../controller/modules/bs/definicion/BSPERSON/validador/validaTipoSociedad'      );
const vSector   = require('../../../controller/modules/bs/definicion/BSPERSON/validador/validaSector'            );
const vPais     = require('../../../controller/modules/bs/definicion/BSPERSON/validador/validaPais'              );
const vDpto     = require('../../../controller/modules/bs/definicion/BSPERSON/validador/validaProvincia'         );
const vCiudad   = require('../../../controller/modules/bs/definicion/BSPERSON/validador/validaCiudad'            );
const vBarrio   = require('../../../controller/modules/bs/definicion/BSPERSON/validador/validaBarrio'            );
const vTpoIdent = require('../../../controller/modules/bs/definicion/BSPERSON/validador/validaTipoIdentificacion');
const vNroDocum = require('../../../controller/modules/bs/definicion/BSPERSON/validador/validaNroDocumento'      );
const vNroDigit = require('../../../controller/modules/bs/definicion/BSPERSON/validador/validaNroDigito'         );
// LIST      
const lpersona  =  require('../../../controller/modules/bs/definicion/BSPERSON/listar/listCab');
const pqperson  =  require('../../../controller/modules/bs/definicion/BSPERSON/listar/postQuery');

module.exports = function(){
    // GET COD_PERSONA
    router.get('/bs/bsperson/buscar/cod_persona/:cod_empresa', bspersona.get_cod_persona );

    // PERSONA - BUSCADORES
    router.post('/bs/bsperson/buscar/persona'               , bPersona.main  );
    router.post('/bs/bsperson/buscar/tipo_sociedad'         , bTipoSoc.main  );
    router.post('/bs/bsperson/buscar/sector_economico'      , bSector.main   );
    router.post('/bs/bsperson/buscar/pais'                  , bPais.main     );
    router.post('/bs/bsperson/buscar/provincia'             , bDpto.main     );
    router.post('/bs/bsperson/buscar/ciudad'                , bCiudad.main   );
    router.post('/bs/bsperson/buscar/barrio'                , bBarrio.main   );
    router.post('/bs/bsperson/buscar/tipo_identificacion'   , bTipIden.main  );
    
    // PERSONA - VALIDATE
    router.post('/bs/bsperson/valida/tipo_sociedad'         , vTipoSoc.main  );
    router.post('/bs/bsperson/valida/sector_economico'      , vSector.main   );
    router.post('/bs/bsperson/valida/pais'                  , vPais.main     );
    router.post('/bs/bsperson/valida/provincia'             , vDpto.main     );
    router.post('/bs/bsperson/valida/ciudad'                , vCiudad.main   );
    router.post('/bs/bsperson/valida/barrio'                , vBarrio.main   );
    router.post('/bs/bsperson/valida/tipo_identificacion'   , vTpoIdent.main );
    router.post('/bs/bsperson/valida/documento'             , vNroDocum.main );
    router.post('/bs/bsperson/valida/digito_verificador'    , vNroDigit.main );
    
    // PERSONA - LISTAR 
    router.post('/bs/bsperson/list/persona'                 , lpersona.main  );
    router.post('/bs/bsperson/list/postqueryCab'            , pqperson.main  );

    // ABM
    router.post('/bs/bsperson'                              , bspersona.main );    
    return router;
}