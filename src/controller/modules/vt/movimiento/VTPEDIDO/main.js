const oracledb            = require("oracledb");
const db                  = require("../../../../../connection/conn"          );
const crypto              = require("../../../../../utils/crypto"             );
const { log_error}        = require('../../../../../utils/logger'             );
const tableData           = require('./tableDate');
const { generate_update } = require('../../../../../utility/generate_update'  );
const { generate_insert } = require('../../../../../utility/generate_insert'  );
const { generate_delete } = require('../../../../../utility/generate_delete'  );
const { validateBooleanFunction } = require('../../../../../utils/validate'   );

exports.getNroComp = async (req, res, next) => {
  let { cod_empresa, tip_comprobante, ser_comprobante}     = req.params;
  try {
    var sql = ` select nvl( max(to_number(c.nro_comprobante) ) , 0 ) + 1 id
                  from vt_pedidos_cabecera c 
                 where c.cod_empresa     =:cod_empresa
                   and c.tip_comprobante =:tip_comprobante
                   and c.ser_comprobante =:ser_comprobante`;
    var data = [cod_empresa,tip_comprobante,ser_comprobante];
    const response = await db.Open(sql,data,true,req.headers.authuser,await crypto.decrypt(req.headers.authpass));
    res.status(200).json(response);
  } catch (error) {
    log_error.error(`getNroComprobante ${error}`)
    console.log(error);
    next();
  }
}
// NRO_ORDEN
exports.getNrOrden = async (req, res, next) => {
  let { cod_empresa, tip_comprobante, ser_comprobante, nro_comprobante} = req.params;
  try {
    var sql = ` select nvl( max(to_number(c.orden) ) , 0 ) + 1 id
                  from vt_pedidos_detalle c 
                  where c.cod_empresa = :cod_empresa
                    and c.tip_comprobante = :tip_comprobante
                    and c.ser_comprobante = :ser_comprobante
                    and c.nro_comprobante = :nro_comprobante`;
    var data = [cod_empresa,tip_comprobante,ser_comprobante,nro_comprobante];
    const response = await db.Open(sql,data,true,req.headers.authuser,await crypto.decrypt(req.headers.authpass));
    res.status(200).json(response);
  } catch (error) {
    log_error.error(`getNroOrden ${error}`)
    console.log(error);
    next();
  }
}
exports.main = async(req, res, next)=>{
  var content      = req.body;
  const ip         = req.headers['cf-connecting-ip'] || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  var direccion_ip = ip.replace("::ffff:","");
  var cod_usuario  = content.AditionalData[0].cod_usuario;
  var cod_empresa  = content.AditionalData[0].cod_empresa;

  let datosInserCab  = "";
  let datosUpdatCab  = "";
  let deleteCab      = "";
  if(content.updateInserData.length > 0 || content.delete_cab.length > 0){

  if(content.exitInsertedBand){

    var VALIDA_CAB = [
      {
        campo			 : 'COD_SUCURSAL',
        paquete		 : 'EDS_STENVIO.',
        funcion		 : 'VALIDA_SUCURSAL',			
        in_params  : ['COD_EMPRESA','COD_SUCURSAL'],
        out_params : ['DESC_SUCURSAL']  ,
      }
      // ,{
      //   campo			 : 'COD_MOTIVO',
      //   paquete		 : 'EDS_STENVIO.',
      //   funcion		 : 'VALIDA_MOTIVOS',			
      //   in_params  : ['COD_EMPRESA','COD_SUCURSAL','COD_MOTIVO'],
      //   out_params : ['DESC_MOTIVO'],
      // }
    ]  
    var result = await validateBooleanFunction(content.updateInserData, VALIDA_CAB, req)
    if(result.valor){
      res.json({'ret': 0,'p_mensaje':result.p_mensaje});
      return
    }
  }

    // CAB
    let NameTableCab   = 'VT_PEDIDOS_CABECERA';
    let tableCab       = tableData.find( item => item.table === NameTableCab);
    datosInserCab  = await generate_insert(NameTableCab, content.updateInserData, {COD_EMPRESA:cod_empresa,FEC_ALTA:'sysdate'},tableCab.column);
    datosUpdatCab  = await generate_update(NameTableCab, content.updateInserData, content.aux_updateInserData,{},{FEC_MODIF:'sysdate',COD_USU_MODIF:`${cod_usuario}`}, tableCab.column,  tableCab.pk);
    deleteCab      = await generate_delete(NameTableCab, content.delete_cab,{ cod_empresa, cod_usuario, direccion_ip, modulo:'VT', paquete:'eds_vtpedido' }, tableCab.column,  tableCab.pk); 
  }
  
  // DET
  let datosInserDet  = "";
  let datosUpdatDet  = "";
  let deleteDet      = "";

  if(content.updateInserDataDet.length > 0 || content.delete_Det.length > 0){

    if(content.exitInsertedBand){

      var VALIDA_DET = [{
        campo			 : 'COD_ARTICULO'  ,
        paquete		 : 'EDS_STENVIO.' ,
        funcion		 : 'VALIDA_ARTICULO',			
        in_params  : ['COD_EMPRESA','COD_SUCURSAL','COD_ARTICULO'],
        out_params : ['DESC_ARTICULO','COSTO_ULTIMO','COD_UNIDAD_MEDIDA','NRO_LOTE','FEC_VENCIMIENTO'],
        out_type   : {'COSTO_ULTIMO':'NUMBER','FEC_VENCIMIENTO':'DATE'}
      }]

      var result = await validateBooleanFunction(content.updateInserDataDet, VALIDA_DET, req)
      if(result.valor){
        res.json({'ret': 0,'p_mensaje':result.p_mensaje});
        return
      }
    }

    let NameTableDet   = 'VT_PEDIDOS_DETALLE';
    let tableDet       = tableData.find( item => item.table === NameTableDet);
    datosInserDet  = await generate_insert(NameTableDet, content.updateInserDataDet, {COD_EMPRESA:cod_empresa},tableDet.column);
    datosUpdatDet  = await generate_update(NameTableDet, content.updateInserDataDet, content.aux_updateInserDataDet,{},{}, tableDet.column,  tableDet.pk);
    deleteDet      = await generate_delete(NameTableDet, content.delete_Det,{ cod_empresa, cod_usuario, direccion_ip, modulo:'VT', paquete:'eds_vtpedido' }, tableDet.column,  tableDet.pk);   
  }
  
  try {
  var sql =   `
          BEGIN
              :ret := eds_vtpedido.abm ( -- CAB
                                          :p_delete_cab  ,
                                          :p_update_cab  ,
                                          :p_insert_cab  ,
                                          -- DET
                                          :p_delete_det  ,
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
        // --- DET 
        p_delete_det  : deleteDet    ,
        p_update_det  : datosUpdatDet,
        p_insert_det  : datosInserDet,

        p_mensaje          : { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 300 },
        ret                : { dir: oracledb.BIND_OUT, type: oracledb.NUMBER, maxSize: 300 },
      }, true, req.headers.authuser, await crypto.decrypt(req.headers.authpass) );

    res.status(200).json(result.outBinds ? result.outBinds : {p_mensaje:result.message});
  } catch (error) {
    next();
    log_error.error(` ${error}`)
    log_error.error(`eds_vtpedido result : ${result}`)
    console.log("Error metodo eds_vtpedido",error);
    res.status(200).json({error})
  }
}