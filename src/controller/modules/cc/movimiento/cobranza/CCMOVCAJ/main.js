const oracledb                  = require("oracledb");
const db                        = require("../../../../../../connection/conn"              );
const crypto                    = require("../../../../../../utils/crypto"                 );
const { log_error}              = require('../../../../../../utils/logger'                 );
const tableData                 = require('./tableDate');
const { generate_update }       = require('../../../../../../utility/generate_update');
const { generate_insert }       = require('../../../../../../utility/generate_insert');
const { generate_delete }       = require('../../../../../../utility/generate_delete');
const {validateBooleanFunction} = require('../../../../../../utils/validate'         );
const _                         = require('underscore');

exports.getNroComp = async (req, res, next) => {
  let { cod_empresa, tip_mov_caj, ser_mov_caj}     = req.params;
  try {
    var sql = ` select nvl( max(to_number(c.nro_mov_caj) ) , 0 ) + 1 id
                  from cc_movimientos_cajas c 
                 where c.cod_empresa =:cod_empresa
                   and c.tip_mov_caj =:tip_mov_caj
                   and c.ser_mov_caj =:ser_mov_caj`;
    var data = {cod_empresa,tip_mov_caj,ser_mov_caj};
    const response = await db.Open(sql,data,true,req.headers.authuser,await crypto.decrypt(req.headers.authpass));
    res.status(200).json(response);
  } catch (error) {
    log_error.error(`getNroComp ${error}`)
    console.log(error);
    next();
  }
}
exports.getSecuencia = async (req, res, next) => {
  let { cod_empresa = '', tip_mov_caj = '', ser_mov_caj = '', nro_mov_caj =''}     = req.params;
  try {
    var sql = ` select nvl( max(to_number(c.nro_secuencia) ) , 0 ) + 1 id
                  from cc_formas_cobros c 
                 where c.cod_empresa =:cod_empresa
                   and c.tip_mov_caj =:tip_mov_caj
                   and c.ser_mov_caj =:ser_mov_caj
                   and c.nro_mov_caj =:nro_mov_caj`;
    var data = {cod_empresa, tip_mov_caj, ser_mov_caj, nro_mov_caj};
    const response = await db.Open(sql,data,true,req.headers.authuser,await crypto.decrypt(req.headers.authpass));
    res.status(200).json(response);
  } catch (error) {
    log_error.error(`getSecuencia ${error}`)
    console.log(error);
    next();
  }
}

exports.main = async(req, res, next)=>{
  var content      = req.body;
  const ip         = req.headers['cf-connecting-ip'] || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  var direccion_ip = ip.replace("::ffff:","");
  var cod_usuario  = content.auditoria.cod_usuario;
  var cod_empresa  = content.auditoria.cod_empresa;
  var v_band       = false;


  let datosInserCab  = ""
  let datosUpdatCab  = ""
  let deleteCab      = ""
  // CAB
  if(content.updateInserData.length > 0 || content.delete_cab.length > 0){
    let NameTableCab   = 'CC_MOVIMIENTOS_CAJAS';
    let tableCab       = tableData.find( item => item.table === NameTableCab);
    datosInserCab   = await generate_insert(NameTableCab, content.updateInserData, {COD_EMPRESA:cod_empresa,FEC_ALTA:'sysdate',COD_USUARIO:`'${cod_usuario}'`},tableCab.column);
    datosUpdatCab   = await generate_update(NameTableCab, content.updateInserData, content.aux_updateInserData,{},{}, tableCab.column,  tableCab.pk);
    deleteCab       = await generate_delete(NameTableCab, content.delete_cab,{ cod_empresa, cod_usuario, direccion_ip, modulo:'CC', paquete:'eds_ccmovcaj' }, tableCab.column,  tableCab.pk);
  }

  let datosInserRef  = "";
  let datosUpdatRef  = "";
  if(content.updateInserDataRef.length > 0){
    // REF
    let NameTableRef   = 'CC_MOVIMIENTOS_COMP';
    let tableRef       = tableData.find( item => item.table === NameTableRef);
    datosInserRef  = await generate_insert(NameTableRef, content.updateInserDataRef, {COD_EMPRESA:cod_empresa},tableRef.column);
    datosUpdatRef  = await generate_update(NameTableRef, content.updateInserDataRef, content.aux_updateInserDataRef,{},{}, tableRef.column,  tableRef.pk);
  }
  
  // REF
  let datosInserDet  = "";
  let datosUpdatDet  = "";
  // let deleteDet      = "";
  let NameTableDet   = 'CC_FORMAS_COBROS';
  if(content.updateInserDataDet.length > 0 || content.delete_Det.length > 0){

    var band      = false
    var resultado = {};
    if(content.delete_Det.length === 0){
      for (let index = 0; index < content.updateInserDataDet.length; index++) {
        const element = content.updateInserDataDet[index];
        const {  COD_EMPRESA       = ''
               , COD_MODULO        = ''
               , TIPO_TRANS        = '' 
               , SUB_TIPO_TRANS    = ''
               , COD_CLIENTE       = ''
               , TIP_DOCUMENTO     = ''
               , SER_DOCUMENTO     = ''
               , NRO_DOCUMENTO     = ''
               , CARGA_VALORES     = ''
               , COD_BANCO         = ''
               , NRO_CUENTA        = ''
               , CARGA_CUENTA_CLI  = ''
               , COD_BANCO_CLIENTE = ''
               , CARGA_BANCO_CLI   = ''
               , CARGA_VENCIMIENTO = ''
               , FEC_VENCIMIENTO   = ''
               , COD_MONEDA_COBRO  = ''
               , FEC_MOV_CAJ       = ''
               , CARGA_RETENCION   = '' 
              } = element;  
        let paramsGral = [{ COD_EMPRESA 
                          , COD_MODULO  
                          , TIPO_TRANS  
                          , SUB_TIPO_TRANS    
                          , COD_CLIENTE 
                          , TIP_DOCUMENTO
                          , SER_DOCUMENTO
                          , NRO_DOCUMENTO
                          , CARGA_VALORES
                          , COD_BANCO
                          , NRO_CUENTA
                          , CARGA_CUENTA_CLI
                          , COD_BANCO_CLIENTE
                          , CARGA_BANCO_CLI
                          , CARGA_VENCIMIENTO
                          , FEC_VENCIMIENTO
                          , COD_MONEDA_COBRO
                          , FEC_MOV_CAJ
                          , CARGA_RETENCION
                          , COD_USUARIO : cod_usuario
                          }];
        let in_params = paramsGral.map( item => { return _.keys(item) });  
        let valida 		= [{
          campo			: 'COD_EMPRESA'	,
          paquete		: 'EDS_CCMOVCAJ.' ,
          funcion		: 'valida_general',
          in_params	: in_params[0],
          out_params: [],
        }];
        resultado = await validateBooleanFunction(paramsGral, valida, req);
        if(resultado.valor){
          band = true
          break
        }
      }
      if(band){
        v_mensaje = {'ret': 0,'p_mensaje':resultado.p_mensaje}
        res.json(v_mensaje);
        return
      }
    }
    

    let tableDet       = tableData.find( item => item.table === NameTableDet);
    datosInserDet  = await generate_insert(NameTableDet, content.updateInserDataDet, {COD_EMPRESA:cod_empresa},tableDet.column);
    datosUpdatDet  = await generate_update(NameTableDet, content.updateInserDataDet, content.aux_updateInserDataDet,{},{}, tableDet.column,  tableDet.pk);
    // deleteDet      = await generate_delete(NameTableDet, content.delete_Det,{ cod_empresa, cod_usuario, direccion_ip, modulo:'CC', paquete:'eds_ccmovcaj' }, tableDet.column,  tableDet.pk);   
  }

  try {
   var sql =   `
          BEGIN
              :ret := eds_ccmovcaj.abm_ccmovcaj ( -- CAB
                                                :p_delete_cab  ,
                                                :p_update_cab  ,
                                                :p_insert_cab  ,
                                                -- REF
                                                :p_update_ref  ,
                                                :p_insert_ref  ,
                                                -- DET
                                                :p_update_det  ,
                                                :p_insert_det  ,
                                                --
                                                :p_mensaje
                                              );
          END;`;
      const result  = await db.Open(sql,{
        // --- CAB 
        p_delete_cab  : deleteCab    ,
        p_update_cab  : datosUpdatCab,
        p_insert_cab  : datosInserCab,
        // --- REF 
        p_update_ref  : datosUpdatRef,
        p_insert_ref  : datosInserRef,
        // --- DET 
        p_update_det  : datosUpdatDet,
        p_insert_det  : datosInserDet,

        p_mensaje          : { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 300 },
        ret                : { dir: oracledb.BIND_OUT, type: oracledb.NUMBER, maxSize: 300 },
      }, true, req.headers.authuser, await crypto.decrypt(req.headers.authpass) );
    res.status(200).json(result.outBinds ? result.outBinds : {p_mensaje:result.message});
  } catch (error) {
    next();
    log_error.error(` ${error}`)
    log_error.error(`eds_ccmovcaj resul : ${result}`)
    console.log("Error metodo eds_ccmovcaj",error);
    res.status(200).json({error})
  }
}