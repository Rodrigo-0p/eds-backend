const express   = require('express');
const router    = express.Router();
const vccmovcaj = "/cc/ccmovcaj";
// BUSCAR
const bPreForm               = require('../../../../controller/modules/cc/movimiento/cobranza/CCMOVCAJ/buscador/getPreForm'        );
const bSubTipTra             = require('../../../../controller/modules/cc/movimiento/cobranza/CCMOVCAJ/buscador/getSubTipoTrans'   );
const bBancCliet             = require('../../../../controller/modules/cc/movimiento/cobranza/CCMOVCAJ/buscador/getBancoCliente'   );
const bMonedaCob             = require('../../../../controller/modules/cc/movimiento/cobranza/CCMOVCAJ/buscador/getMonedaCobro'    );
const bNroDocume             = require('../../../../controller/modules/cc/movimiento/cobranza/CCMOVCAJ/buscador/getNroDocumento'   );
const bCargarCobroCobra      = require('../../../../controller/modules/cc/movimiento/cobranza/CCMOVCAJ/buscador/getCargarCobroCobra');
// LIST
const lcabecera              = require('../../../../controller/modules/cc/movimiento/cobranza/CCMOVCAJ/listar/listarCab'           );
const lreferencia            = require('../../../../controller/modules/cc/movimiento/cobranza/CCMOVCAJ/listar/listarRef'           );
const ldetalle               = require('../../../../controller/modules/cc/movimiento/cobranza/CCMOVCAJ/listar/listarDet'           );
// VALIDA            
const vmonedas               = require('../../../../controller/modules/cc/movimiento/cobranza/CCMOVCAJ/validador/validaMoneda'     );
const vcliente               = require('../../../../controller/modules/cc/movimiento/cobranza/CCMOVCAJ/validador/validaCliente'    );
const vNroPlaRef             = require('../../../../controller/modules/cc/movimiento/cobranza/CCMOVCAJ/validador/validaNroPlanRef' );
const vNroComRef             = require('../../../../controller/modules/cc/movimiento/cobranza/CCMOVCAJ/validador/validaComproRef'  );
const vNroCuota              = require('../../../../controller/modules/cc/movimiento/cobranza/CCMOVCAJ/validador/validaCuota'      );
const vTotComprob            = require('../../../../controller/modules/cc/movimiento/cobranza/CCMOVCAJ/validador/validaTotalComp'  );
// DE
const vsub_tipo_trans        = require('../../../../controller/modules/cc/movimiento/cobranza/CCMOVCAJ/validador/validaSubTipTrans' );
const vser_documento         = require('../../../../controller/modules/cc/movimiento/cobranza/CCMOVCAJ/validador/validaSerDocument' );
const vnro_documento         = require('../../../../controller/modules/cc/movimiento/cobranza/CCMOVCAJ/validador/validaNroDocument' );
const vcod_banco_cliente     = require('../../../../controller/modules/cc/movimiento/cobranza/CCMOVCAJ/validador/validaBancoRef'    );
const vnro_cuenta            = require('../../../../controller/modules/cc/movimiento/cobranza/CCMOVCAJ/validador/validaNroCuentaRef');
const vfec_vencimiento       = require('../../../../controller/modules/cc/movimiento/cobranza/CCMOVCAJ/validador/validaFechaVenci'  );
const vcod_moneda_cobro      = require('../../../../controller/modules/cc/movimiento/cobranza/CCMOVCAJ/validador/validaMonedaCobr'  );
const vtip_cambio            = require('../../../../controller/modules/cc/movimiento/cobranza/CCMOVCAJ/validador/validaTipCambio'   );
const vnro_cuenta_caja_chica = require('../../../../controller/modules/cc/movimiento/cobranza/CCMOVCAJ/validador/validaCajaInterna' );
const vmonto                 = require('../../../../controller/modules/cc/movimiento/cobranza/CCMOVCAJ/validador/validaMonto'       );
// BUSCAR
const bmonedas               = require('../../../../controller/modules/cc/movimiento/cobranza/CCMOVCAJ/buscador/getMoneda' );
const bcliente               = require('../../../../controller/modules/cc/movimiento/cobranza/CCMOVCAJ/buscador/getCliente');
// MAIN
const mainVccmovcaja         = require('../../../../controller/modules/cc/movimiento/cobranza/CCMOVCAJ/main');

module.exports = function(){
  
  // NRO AUTO
  router.get(vccmovcaj  + '/:cod_empresa/:tip_mov_caj/:ser_mov_caj'              , mainVccmovcaja.getNroComp   );
  router.get(vccmovcaj  + '/:cod_empresa/:tip_mov_caj/:ser_mov_caj/:nro_mov_caj' , mainVccmovcaja.getSecuencia );
  router.post(vccmovcaj , mainVccmovcaja.main  );
  // preform
  router.post(vccmovcaj + '/preform'                     , bPreForm.main              );
  router.post(vccmovcaj + '/buscar/subTipTrans'          , bSubTipTra.main            );
  router.post(vccmovcaj + '/buscar/bancoClient'          , bBancCliet.main            );
  router.post(vccmovcaj + '/buscar/monedaCob'            , bMonedaCob.main            );
  router.post(vccmovcaj + '/buscar/nrodocument'          , bNroDocume.main            );
  // listar                     
  router.post(vccmovcaj + '/listar/cab'                  , lcabecera.main             );
  router.post(vccmovcaj + '/listar/ref'                  , lreferencia.main           );
  router.post(vccmovcaj + '/listar/det'                  , ldetalle.main              );
  // valida                     
  router.post(vccmovcaj + '/valida/moneda'               , vmonedas.main              );
  router.post(vccmovcaj + '/valida/cliente'              , vcliente.main              );
  router.post(vccmovcaj + '/valida/planRef'              , vNroPlaRef.main            );
  router.post(vccmovcaj + '/valida/comprRef'             , vNroComRef.main            );
  router.post(vccmovcaj + '/valida/nrocuota'             , vNroCuota.main             );
  router.post(vccmovcaj + '/valida/totCompr'             , vTotComprob.main           );
  // DET
  router.post(vccmovcaj + '/valida/sub_tipo_trans'       , vsub_tipo_trans.main       );
  router.post(vccmovcaj + '/valida/ser_documento'        , vser_documento.main        );
  router.post(vccmovcaj + '/valida/nro_documento'        , vnro_documento.main        );
  router.post(vccmovcaj + '/valida/cod_banco_cliente'    , vcod_banco_cliente.main    );
  router.post(vccmovcaj + '/valida/nro_cuenta'           , vnro_cuenta.main           );
  router.post(vccmovcaj + '/valida/fec_vencimiento'      , vfec_vencimiento.main      );
  router.post(vccmovcaj + '/valida/cod_moneda_cobro'     , vcod_moneda_cobro.main     );
  router.post(vccmovcaj + '/valida/tip_cambio'           , vtip_cambio.main           );
  router.post(vccmovcaj + '/valida/nro_cuenta_caja_chica', vnro_cuenta_caja_chica.main);
  router.post(vccmovcaj + '/valida/monto'                , vmonto.main                );
  // BUSCAR
  router.post(vccmovcaj + '/buscar/moneda'               , bmonedas.main              );
  router.post(vccmovcaj + '/buscar/cliente'              , bcliente.main              );
  router.post(vccmovcaj + '/buscar/cobrocobran'          , bCargarCobroCobra.main     );
  
  return router;
}