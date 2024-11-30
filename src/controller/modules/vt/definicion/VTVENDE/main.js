const oracledb                  = require("oracledb");
const db                        = require("../../../../../connection/conn"              );
const crypto                    = require("../../../../../utils/crypto"                 );
const { log_error}              = require('../../../../../utils/logger'                 );
const { generate_delete }       = require('../../../../../utils/generate_delete_script' );
const { generate_update }       = require('../../../../../utils/generate_update_script' );
const { generate_insert }       = require('../../../../../utils/generate_insert_script' );
const {validateBooleanFunction} = require('../../../../../utils/validate'               );

exports.get_cod_vendedor  = async (req, res, next) => {
  var cod_empresa = req.params.cod_empresa;
  try {
    var sql = `select nvl(max(to_number(c.cod_vendedor)), 0) + 1 id
                 from vt_vendedores c
                where c.cod_empresa =:cod_empresa`;
  const response = await db.Open(sql,{cod_empresa},true,req.headers.authuser,await crypto.decrypt(req.headers.authpass));
  res.status(200).json(response);
  } catch (error) {
    console.log(error);
    log_error.error(`get_cod_vendedor ${error}`)
    next();
  }
}

exports.main = async(req, res, next)=>{
  var content      = req.body;
  const ip         = req.headers['cf-connecting-ip'] || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  var direccion_ip = ip.replace("::ffff:","");
  var cod_usuario  = content.AditionalData.cod_usuario;
  var cod_empresa  = content.AditionalData.cod_empresa;
  
  var VALIDA = [
    {
			campo			 : 'COD_PERSONA'     ,
			paquete		 : 'EDS_VTVENDE.'    ,
			funcion		 : 'VALIDA_PERSONA'  ,
			in_params  : ['COD_PERSONA']   ,
      out_params : ['DESC_PERSONA']  ,
		}
  ]

  if(content.deleteCab.length === 0){  
    var result = await validateBooleanFunction(content.updateInserData, VALIDA, req)
    if(result.valor){
      res.json({'ret': 0,'p_mensaje':result.p_mensaje})
      return
    }    
  }

  let datosUpdate    = {COD_PERSONA:'COD_PERSONA_ANT'}
  let datosInsertCab = await generate_insert(req,'VT_VENDEDORES', content.updateInserData,{FEC_ALTA:'sysdate',COD_USUARIO_ALTA:`'${cod_usuario}'`});
  let datosUpdateCab = await generate_update(req,'VT_VENDEDORES', content.updateInserData,[content.aux_updateInserData],datosUpdate,{FEC_MODI:'sysdate',COD_USUARIO_MODI:`'${cod_usuario}'`});
  let datosDeleteCab = await generate_delete(req,'VT_VENDEDORES', content.deleteCab,{ cod_empresa, cod_usuario, direccion_ip, modulo:'VT', paquete:'eds_vtvende' }); 
 
  try {
  var sql =   `
          BEGIN
              :ret := EDS_VTVENDE.abm_vtvende ( :p_deleteCab,
                                                :p_updateCab,
                                                :p_insertCab,
                                                  --
                                                :p_mensaje
                                               );
          END;`;
      const result  = await db.Open(sql,{
        p_deleteCab  : datosDeleteCab,
        p_updateCab  : datosUpdateCab,
        p_insertCab  : datosInsertCab,
        // ---
        p_mensaje          : { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 300 },
        ret                : { dir: oracledb.BIND_OUT, type: oracledb.NUMBER, maxSize: 300 },
      }, true, req.headers.authuser, await crypto.decrypt(req.headers.authpass) );
      res.status(200).json(result.outBinds);

  } catch (error) {
    next();
    log_error.error(`abm_vtclient ${error}`)
    console.log("Error metodo feb_vtclient",error);
  }
}