const oracledb                  = require("oracledb");
const db                        = require("../../../../../connection/conn"              );
const crypto                    = require("../../../../../utils/crypto"                 );
const { log_error}              = require('../../../../../utils/logger'                 );
const { generate_delete }       = require('../../../../../utils/generate_delete_script' );
const { generate_update }       = require('../../../../../utils/generate_update_script' );
const { generate_insert }       = require('../../../../../utils/generate_insert_script' );
const {validateBooleanFunction} = require('../../../../../utils/validate'               );


exports.get_cod_cliente  = async (req, res, next) => {
  const {cod_empresa} = req.params;
  try {
    var sql = `select nvl(max(to_number(c.cod_cliente)), 0) + 1 id
                 from cc_clientes c
                where c.cod_empresa =:cod_empresa`;
  const response = await db.Open(sql,{cod_empresa},true,req.headers.authuser,await crypto.decrypt(req.headers.authpass));
  res.status(200).json(response);
  } catch (error) {
    console.log(error);
    log_error.error(`get_cod_cliente ${error}`)
    next();
  }
}
exports.get_sub_cliente  = async (req, res, next) => {
  const {cod_empresa,cod_cliente} = req.params;
  try {
    var sql = `select nvl(max(to_number(c.cod_subcliente)), 0) + 1 id
                 from cc_subclientes c
                where c.cod_empresa =:cod_empresa
                  and c.cod_cliente =:cod_cliente`;
  const response = await db.Open(sql,{cod_empresa,cod_cliente},true,req.headers.authuser,await crypto.decrypt(req.headers.authpass));
  res.status(200).json(response);
  } catch (error) {
    console.log(error);
    log_error.error(`get_cod_cliente ${error}`)
    next();
  }
}
exports.main = async(req, res, next)=>{
  var content      = req.body;
  const ip         = req.headers['cf-connecting-ip'] || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  var direccion_ip = ip.replace("::ffff:","");
  var cod_usuario  = content.AditionalData[0].cod_usuario;
  var cod_empresa  = content.AditionalData[0].cod_empresa;
  
  let datosInsertCab = '';
  let datosUpdateCab = '';
  let datosDeleteCab = '';

  if(content.updateInserData.length > 0 || content.delete_cab.length > 0){
    var VALIDA = [
      {
        campo			 : 'COD_PERSONA'    ,
        paquete		 : 'EDS_VTCLIENT.'  ,
        funcion		 : 'VALIDA_CAUSAL'  ,
        in_params  : ['COD_CAUSAL','BLOQUEAR_CLIENTE'],
        out_params : ['DESC_CAUSAL']  ,
      },{
        campo			 : 'COD_GRUPO_CLIENTE'    ,
        paquete		 : 'EDS_VTCLIENT.'        ,
        funcion		 : 'VALIDA_GRUPO_CLIENTE' ,
        in_params  : ['COD_EMPRESA','COD_GRUPO_CLIENTE'],
        out_params : ['DESC_GRUPO_CLIENTE'] ,
      }
    ]
    if(content.delete_cab.length === 0){
      var result = await validateBooleanFunction(content.updateInserData, VALIDA, req)
      if(result.valor){
        res.json({'ret': 0,'p_mensaje':result.p_mensaje})
        return
      }    
    }

    datosInsertCab = await generate_insert(req,'CC_CLIENTES', content.updateInserData,{FEC_ALTA:'sysdate',COD_USUARIO_ALTA:`'${cod_usuario}'`,FEC_BAJA:null});
    datosUpdateCab = await generate_update(req,'CC_CLIENTES', content.updateInserData, [content.aux_updateInserData]);
    datosDeleteCab = await generate_delete(req,'CC_CLIENTES', content.delete_cab,{ cod_empresa, cod_usuario, direccion_ip, modulo:'VT', paquete:'eds_vtclient' }); 
  }

  let datosInsertDet = '';
  let datosUpdateDet = '';
  let datosDeleteDet = '';

  if(content.updateInserDataDet.length > 0 || content.delete_Det.length > 0){
    var VALIDA = [
      {
        campo			 : 'COD_PAIS'       ,
        paquete		 : 'EDS_VTCLIENT.' 	,
        funcion		 : 'VALIDA_PAIS'		,
        in_params  : ['COD_PAIS']     ,
        out_params : ['DESC_PAIS']	  ,
      },
      {
        campo			 : 'COD_PROVINCIA'   	,
        paquete		 : 'EDS_VTCLIENT.'   	,
        funcion		 : 'VALIDA_PROVINCIAS',
        in_params  : ['COD_PAIS','COD_PROVINCIA'],
        out_params : ['DESC_PROVINCIA']	,
      },
      {
        campo			 : 'COD_CIUDAD'    ,
        paquete		 : 'EDS_VTCLIENT.' ,
        funcion		 : 'VALIDA_CIUDAD' ,
        in_params  : ['COD_PAIS'
                    , 'COD_PROVINCIA'
                    , 'COD_CIUDAD']  ,
        out_params : ['DESC_CIUDAD'],
      }
    ]
    if(content.delete_Det.length === 0){
      var result = await validateBooleanFunction(content.updateInserDataDet, VALIDA, req)
      if(result.valor){
        res.json({'ret': 0,'p_mensaje':result.p_mensaje})
        return
      }    
    }
    datosInsertDet = await generate_insert(req,'CC_SUBCLIENTES', content.updateInserDataDet,{ FEC_CADUCIDAD : null
                                                                                            , COD_SUPERPRO  : null
                                                                                            , LATITUD_COB   : null
                                                                                            , LONGITUD_COB  : null
                                                                                            , IND_COBERTURA : null
                                                                                            });
    datosUpdateDet = await generate_update(req,'CC_SUBCLIENTES', content.updateInserDataDet, content.aux_updateInserDataDet,{COD_SUBCLIENTE:'COD_SUBCLIENTE_ANT'});
    datosDeleteDet = await generate_delete(req,'CC_SUBCLIENTES', content.delete_Det,{ cod_empresa, cod_usuario, direccion_ip, modulo:'VT', paquete:'eds_vtclient' }); 
  }

  try {
  var sql =   `
          BEGIN
              :ret := EDS_VTCLIENT.abm_vtclient ( :p_deleteCab,
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
    log_error.error(`abm_vtclient ${error}`)
    console.log("Error metodo EDS_VTCLIENT",error);
  }
}