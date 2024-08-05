const oracledb                  = require("oracledb");
const db                        = require("../../../../../connection/conn"          );
const crypto                    = require("../../../../../utils/crypto"             );
const { log_error}              = require('../../../../../utils/logger'             );
const tableData                 = require('./tableDate');
const { generate_update }       = require('../../../../../utility/generate_update'  );
const { generate_insert }       = require('../../../../../utility/generate_insert'  );
const { generate_delete }       = require('../../../../../utility/generate_delete'  );
const {validateBooleanFunction} = require('../../../../../utils/validate'           );

exports.get_cod_articulo  = async (req, res, next) => {
  const {cod_empresa} = req.params;
  try {
    var sql = `select nvl(max(to_number(c.cod_articulo)), 0) + 1 id
                 from st_articulos c
                where c.cod_empresa =:cod_empresa`;
  const response = await db.Open(sql,{cod_empresa},true,req.headers.authuser,await crypto.decrypt(req.headers.authpass));
  res.status(200).json(response);
  } catch (error) {
    console.log(error);
    log_error.error(`get_cod_articulo ${error}`)
    next();
  }
}

exports.main = async(req, res, next)=>{
  var content      = req.body;
  const ip         = req.headers['cf-connecting-ip'] || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  var direccion_ip = ip.replace("::ffff:","");
  var cod_usuario  = content.AditionalData[0].cod_usuario;
  var cod_empresa  = content.AditionalData[0].cod_empresa;
  
  var VALIDA_CAB = [
    {
			campo			 : 'COD_PROVEEDOR_DFLT',
			paquete		 : 'EDS_STARTICU.'     ,
			funcion		 : 'VALIDA_PROVEEDOR'  ,
			in_params  : ['COD_EMPRESA','COD_PROVEEDOR_DFLT'],
      out_params : ['DESC_PROVEEDOR']  ,
		},{
			campo			 : 'COD_MARCA'         ,
			paquete		 : 'EDS_STARTICU.'     ,
			funcion		 : 'VALIDA_MARCA'      ,
			in_params  : ['COD_EMPRESA','COD_MARCA'],
      out_params : ['DESC_MARCA']      ,
		},{
      campo			 : 'COD_LINEA'         ,
      paquete		 : 'EDS_STARTICU.'     ,
      funcion		 : 'valida_linea'      ,			
      in_params  : ['COD_EMPRESA','COD_MARCA','COD_LINEA'],
      out_params : ['DESC_LINEA']      ,
    },{
      campo			 : 'COD_CATEGORIA'     ,
      paquete		 : 'EDS_STARTICU.'     ,
      funcion		 : 'valida_segmento'   ,			
      in_params  : ['COD_EMPRESA','COD_LINEA','COD_CATEGORIA'],
      out_params : ['DESC_CATEGORIA']  ,
    },{
			campo			 : 'COD_RUBRO'         ,
			paquete		 : 'EDS_STARTICU.'     ,
			funcion		 : 'VALIDA_RUBRO'      ,
			in_params  : ['COD_EMPRESA','COD_RUBRO'],
      out_params : ['DESC_RUBRO']      ,
		},{
			campo			 : 'COD_GRUPO'         ,
			paquete		 : 'EDS_STARTICU.'     ,
			funcion		 : 'VALIDA_GRUPO'      ,
			in_params  : ['COD_EMPRESA','COD_GRUPO'],
      out_params : ['DESC_GRUPO']      ,
		},{
			campo			 : 'COD_IVA'       ,
			paquete		 : 'EDS_STARTICU.' ,
			funcion		 : 'VALIDA_IVA'    ,			
			in_params  : ['COD_EMPRESA','COD_IVA'],
      out_params : ['DESC_IVA']    ,
		}
  ]

  var VALIDA_DET = [
    {
			campo			 : 'COD_UNIDAD_REL'   ,
			paquete		 : 'EDS_STARTICU.'    ,
			funcion		 : 'VALIDA_UM_MEDIDA' ,
			in_params  : ['COD_EMPRESA','COD_UNIDAD_REL'],
      out_params : ['REFERENCIA']     ,
		}
  ]

  if(content.delete_cab.length === 0){  

    var result = await validateBooleanFunction(content.updateInserData, VALIDA_CAB, req)
    if(result.valor){
      res.json({'ret': 0,'p_mensaje':result.p_mensaje})
      return
    }

    var result = await validateBooleanFunction(content.updateInserDataDet, VALIDA_DET, req)
    if(result.valor){
      res.json({'ret': 0,'p_mensaje':result.p_mensaje})
      return
    }
  }

  var datosInsertCab = "";
  var datosUpdateCab = "";
  var datosDeleteCab = "";

  if(content.updateInserData.length > 0 || content.delete_cab.length > 0){
    // CAB
    let NameTableCab   = 'ST_ARTICULOS';
    let tableCab       = tableData.find( item => item.table === NameTableCab);
    datosInsertCab = await generate_insert(NameTableCab,content.updateInserData,{FEC_ALTA:'sysdate',COD_USUARIO_ALTA:`'${cod_usuario}'`,FEC_BAJA:null},tableCab.column);
    datosUpdateCab = await generate_update(NameTableCab,content.updateInserData, [content.aux_updateInserData],{},{}, tableCab.column,  tableCab.pk);
    datosDeleteCab = await generate_delete(NameTableCab,content.delete_cab,{ cod_empresa, cod_usuario, direccion_ip, modulo:'ST', paquete:'eds_starticu' }, tableCab.column,  tableCab.pk); 
  }
  
  var datosInsertDet = "";
  var datosUpdateDet = "";
  var datosDeleteDet = "";

  if(content.updateInserDataDet.length > 0 || content.delete_Det.length > 0){
    // DET
    let NameTableDet   = 'ST_RELACIONES';
    let tableDet       = tableData.find( item => item.table === NameTableDet);
    datosInsertDet = await generate_insert(NameTableDet,content.updateInserDataDet, {COD_EMPRESA:cod_empresa},tableDet.column);
    datosUpdateDet = await generate_update(NameTableDet,content.updateInserDataDet, content.aux_updateInserDataDet,{IND_BASICO:'IND_BASICO_ANT',COD_UNIDAD_REL:'COD_UNIDAD_REL_ANT'},{}, tableDet.column,  tableDet.pk);
    datosDeleteDet = await generate_delete(NameTableDet,content.delete_Det,{ cod_empresa, cod_usuario, direccion_ip, modulo:'ST', paquete:'EDS_STARTICU' }, tableDet.column,  tableDet.pk);   
  }

  try {
  var sql =   `
          BEGIN
              :ret := EDS_STARTICU.abm_starticu ( :p_deleteCab,
                                                  :p_updateCab,
                                                  :p_insertCab,
                                                  --
                                                  :p_deleteDet,
                                                  :p_updateDet,
                                                  :p_insertDet,
                                                  --
                                                  :p_mensaje
                                                );
          END;`;
      const result  = await db.Open(sql,{
        p_deleteCab  : datosDeleteCab,
        p_updateCab  : datosUpdateCab,
        p_insertCab  : datosInsertCab,
        // ---
        p_deleteDet  : datosDeleteDet,
        p_updateDet  : datosUpdateDet,
        p_insertDet  : datosInsertDet,
        // ---
        p_mensaje          : { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 300 },
        ret                : { dir: oracledb.BIND_OUT, type: oracledb.NUMBER, maxSize: 300 },
      }, true, req.headers.authuser, await crypto.decrypt(req.headers.authpass) );
      res.status(200).json(result.outBinds);

  } catch (error) {
    next();
    log_error.error(`abm_starticulo  ${error}`)
    console.log("Error metodo feb_starticu",error);
  }
}
