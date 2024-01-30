const oracledb                  = require("oracledb");
const db                        = require("../../../../../connection/conn"          );
const crypto                    = require("../../../../../utils/crypto"             );
const { log_error}              = require('../../../../../utils/logger'             );
const tableData                 = require('./tableDate');
const { generate_update }       = require('../../../../../utility/generate_update'  );
const { generate_insert }       = require('../../../../../utility/generate_insert'  );
const { generate_delete }       = require('../../../../../utility/generate_delete'  );
const {validateBooleanFunction} = require('../../../../../utils/validate'           );

exports.getNroEntSal = async (req, res, next) => {
  var cod_empresa = req.params.cod_empresa;
  try {
    var sql = ` select nvl( max(to_number(c.nro_ent_sal) ) , 0 ) + 1 id
                  from st_entsal_cab c 
                 where c.cod_empresa =:cod_empresa`;
    var data = [cod_empresa];
    const response = await db.Open(sql,data,true,req.headers.authuser,await crypto.decrypt(req.headers.authpass));
    res.status(200).json(response);
  } catch (error) {
    log_error.error(`getNroEntSal ${error}`)
    console.log(error);
    next();
  }
}

// NRO_ORDEN
exports.getNrOrden = async (req, res, next) => {
  var cod_empresa     = req.params.cod_empresa;
  var cod_nro_ent_sal = req.params.cod_nro_ent_sal;

  try {
    var sql = ` select nvl( max(to_number(c.nro_orden) ) , 0 ) + 1 id
                  from st_entsal_det c 
                  where c.cod_empresa = :cod_empresa
                    and c.tip_ent_sal = 'AJS'
                    and c.ser_ent_sal = 'A'
                    and c.nro_ent_sal = :cod_nro_ent_sal`;
    var data = [cod_empresa,cod_nro_ent_sal];
    const response = await db.Open(sql,data,true,req.headers.authuser,await crypto.decrypt(req.headers.authpass));
    res.status(200).json(response);
  } catch (error) {
    log_error.error(`getNroEntSal ${error}`)
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
  var v_band       = false;

  //  VALIDA CAB
  var VALIDA_CAB = [
    {
      campo			 : 'COD_SUCURSAL',
      paquete		 : 'EDS_STENTSAL.',
      funcion		 : 'VALIDA_SUCURSAL',			
      in_params  : ['COD_EMPRESA','COD_SUCURSAL'],
      out_params : ['DESC_SUCURSAL']  ,
    },{
      campo			 : 'COD_MOTIVO'  ,
      paquete		 : 'EDS_STENTSAL.' ,
      funcion		 : 'VALIDA_MOTIVO'  ,			
      in_params  : ['COD_EMPRESA','COD_SUCURSAL','COD_MOTIVO'],
      out_params : ['DESC_MOTIVO','IND_ENT_SAL','AFECTA_COSTO']  ,
    },{
      campo			 : 'COD_SUCURSAL'  ,
      paquete		 : 'EDS_STENTSAL.' ,
      funcion		 : 'VALIDA_SUCURSAL'  ,			
      in_params  : ['COD_EMPRESA','COD_SUCURSAL'],
      out_params : ['DESC_DEPOSITO']  ,
    },{
      campo			 : 'COD_EMPRESA'  ,
      paquete		 : 'EDS_STENTSAL.' ,
      funcion		 : 'VALIDA_PROVEEDOR'  ,			
      in_params  : ['COD_EMPRESA','COD_PROVEEDOR'],
      out_params : ['DESC_PROVEEDOR']  ,
    },{
      campo			 : 'COD_MONEDA'  ,
      paquete		 : 'EDS_STENTSAL.' ,
      funcion		 : 'VALIDA_MONEDA'  ,			
      in_params  : ['COD_MONEDA'],
      out_params : ['DESC_MONEDA','DECIMALES','TIP_CAMBIO','TIP_CAMBIO_US'],
      out_type   : { DECIMALES: 'NUMBER',TIP_CAMBIO:'NUMBER',TIP_CAMBIO_US:'NUMBER'},
    }
  ]

  if(content.exitInsertedBand){
    var result = await validateBooleanFunction(content.updateInserData, VALIDA_CAB, req)
    if(result.valor){
      v_mensaje = {'ret': 0,'p_mensaje':result.p_mensaje}
      v_band    = true
    }
  }

  //  VALIDA DETALLE
  var VALIDA_DET = [{
    campo			 : 'COD_ARTICULO'  ,
    paquete		 : 'EDS_STENTSAL.' ,
    funcion		 : 'VALIDA_ARTICULO',			
    in_params  : ['COD_EMPRESA','COD_SUCURSAL','COD_ARTICULO'],
    out_params : ['DESC_ARTICULO','COSTO_ULTIMO','COD_UNIDAD_MEDIDA','DESC_UM','IND_MAN_STOCK','NRO_LOTE','FEC_VENCIMIENTO'],
    out_type   : {'COSTO_ULTIMO':'NUMBER','FEC_VENCIMIENTO':'DATE'}
  }]

  if(content.exitInsertedBand){
    var result = await validateBooleanFunction(content.updateInserDataDet, VALIDA_DET, req)
    if(result.valor){
      v_mensaje = {'ret': 0,'p_mensaje':result.p_mensaje}
      v_band    = true
    }
  }

  // ||============================================= RETORNA, SI HAY VALIDA QUE NO CORRESPONDA   ============================== ||
  if(v_band){
   res.json(v_mensaje);
   return
  }

  // CAB
  let NameTableCab   = 'ST_ENTSAL_CAB';
	let tableCab       = tableData.find( item => item.table === NameTableCab);
  let datosInserCab  = await generate_insert(NameTableCab, content.updateInserData, {COD_EMPRESA:cod_empresa,FEC_ALTA:'sysdate'},tableCab.column);
  let datosUpdatCab  = await generate_update(NameTableCab, content.updateInserData, content.aux_updateInserData,{},{FEC_MODIF:'sysdate'}, tableCab.column,  tableCab.pk);
  let deleteCab      = await generate_delete(NameTableCab, content.delete_cab,{ cod_empresa, cod_usuario, direccion_ip, modulo:'ST', paquete:'eds_stentsal' }, tableCab.column,  tableCab.pk); 

  // DET
  let NameTableDet   = 'ST_ENTSAL_DET';
	let tableDet       = tableData.find( item => item.table === NameTableDet);
  let datosInserDet  = await generate_insert(NameTableDet, content.updateInserDataDet, {COD_EMPRESA:cod_empresa},tableDet.column);
  let datosUpdatDet  = await generate_update(NameTableDet, content.updateInserDataDet, content.aux_updateInserDataDet,{},{}, tableDet.column,  tableDet.pk);
  let deleteDet      = await generate_delete(NameTableDet, content.delete_Det,{ cod_empresa, cod_usuario, direccion_ip, modulo:'ST', paquete:'eds_stentsal' }, tableDet.column,  tableDet.pk); 
  
  try {
  var sql =   `
          BEGIN
              :ret := eds_stentsal.abm_stentsal ( -- CAB
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
    next();abm_sttranst
    log_error.error(` ${error}`)
    log_error.error(`abm_sttranst resul : ${result}`)
    console.log("Error metodo eds_stentsal",error);
    res.status(200).json({error})
  }
}