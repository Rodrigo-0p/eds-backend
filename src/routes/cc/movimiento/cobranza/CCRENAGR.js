const express = require('express');
const router  = express.Router();

// list

// valida
const vCliente   = require('../../../../controller/modules/cc/movimiento/cobranza/CCRENAGR/validador/validaCliente');
const vNroCuenta = require('../../../../controller/modules/cc/movimiento/cobranza/CCRENAGR/validador/validaNroCuenta');
const vpagar     = require('../../../../controller/modules/cc/movimiento/cobranza/CCRENAGR/validador/validaPagar');
// buscar
const bCliente   = require('../../../../controller/modules/cc/movimiento/cobranza/CCRENAGR/buscador/getCliente' );
const bNroCuenta = require('../../../../controller/modules/cc/movimiento/cobranza/CCRENAGR/buscador/getCuenta'  );
const bPreForm   = require('../../../../controller/modules/cc/movimiento/cobranza/CCRENAGR/buscador/getPreForm' );
const bcabecera  = require('../../../../controller/modules/cc/movimiento/cobranza/CCRENAGR/buscador/listCab'    );
module.exports = function(){

  // preform
  router.post('/cc/ccrenagr/preform'         , bPreForm.main    );
  // valida
  router.post('/cc/ccrenagr/valida/cliente'  , vCliente.main    );
  router.post('/cc/ccrenagr/valida/cuenta'   , vNroCuenta.main  );
  router.post('/cc/ccrenagr/valida/pagar'    , vpagar.main      );
  // buscar
  router.post('/cc/ccrenagr/buscar/cliente'  , bCliente.main    );
  router.post('/cc/ccrenagr/buscar/cuenta'   , bNroCuenta.main  );
  router.post('/cc/ccrenagr/buscar/cabecera' , bcabecera.main   );
  
  return router;
}