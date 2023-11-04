const oracledb                  = require("oracledb");
const db                        = require("../../../../../connection/conn"              );
const crypto                    = require("../../../../../utils/crypto"                 );
const { log_error}              = require('../../../../../utils/logger'                 );
const { generate_delete }       = require('../../../../../utils/generate_delete_script' );
const { generate_update }       = require('../../../../../utils/generate_update_script' );
const { generate_insert }       = require('../../../../../utils/generate_insert_script' );
const {validateBooleanFunction} = require('../../../../../utils/validate'               );


exports.get_cod_persona  = async (req, res, next) => {
  // var cod_empresa = req.params.cod_empresa;
  try {
    var sql = `select nvl(max(to_number(c.cod_persona)), 0) + 1 id
                from bs_personas c`;
  const response = await db.Open(sql,[],true,req.headers.authuser,await crypto.decrypt(req.headers.authpass));
  res.status(200).json(response);
  } catch (error) {
    console.log(error);
    log_error.error(`get_cod_persona ${error}`)
    next();
  }
}

exports.main = async(req, res, next)=>{
  var content      = req.body;
  const ip         = req.headers['cf-connecting-ip'] || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  var direccion_ip = ip.replace("::ffff:","");
  var cod_usuario  = content.AditionalData[0].cod_usuario;
  var cod_empresa  = content.AditionalData[0].cod_empresa;

  var VALIDA_NRO_DOCUMETO = [
    {
    campo			 : 'TIPO_SOCIEDAD'       ,
    paquete		 : 'EDS_BSPERSON.'  		 ,
    funcion		 : 'VALIDA_TIPO_SOCIEDAD',
    in_params  : ['TIPO_SOCIEDAD']     ,
    out_params : ['DESC_TIPO_SOCIEDAD'],
   },{
    campo			 : 'COD_SECTOR'             ,
    paquete		 : 'EDS_BSPERSON.'  	      ,
    funcion		 : 'VALIDA_SECTOR_ECONOMICO',
    in_params  : ['COD_SECTOR']      		  ,
    out_params : ['DESC_SECTOR'],
  },{
    campo			 : 'COD_PAIS'               ,
    paquete		 : 'EDS_BSPERSON.'  	      ,
    funcion		 : 'VALIDA_PAIS'            ,
    in_params  : ['COD_PAIS']      		    ,
    out_params : ['DESC_PAIS'],
  },{
    campo			 : 'COD_PROVINCIA'          ,
    paquete		 : 'EDS_BSPERSON.'          ,
    funcion		 : 'VALIDA_PROVINCIAS'      ,
    in_params  : ['COD_PAIS','COD_PROVINCIA'] ,
    out_params : ['DESC_PROVINCIA'],
  },
  { campo			 : 'COD_CIUDAD'               ,
    paquete		 : 'EDS_BSPERSON.'            ,
    funcion		 : 'VALIDA_CIUDAD'            ,
    in_params  : ['COD_PAIS','COD_PROVINCIA','COD_CIUDAD'],
    out_params : ['DESC_CIUDAD'],
  },{
    campo			 : 'COD_IDENT'              ,
    paquete		 : 'EDS_BSPERSON.'          ,
    funcion		 : 'VALIDA_IDENTIFICACIONES',
    in_params  : ['COD_IDENT']            ,
    out_params : ['DESC_IDENT']           ,
  },{
    campo			 : 'NRO_DOCUMENTO'       ,
    paquete		 : 'EDS_BSPERSON.'       ,
    funcion		 : 'VALIDA_NRO_DOCUMENTO',
    in_params  : ['COD_PERSONA', 'COD_IDENT', 'NRO_DOCUMENTO'] ,
    in_type    : {'NRO_DOCUMENTO' : 'NUMBER'},
    bind_type  : {'NRO_DOCUMENTO' : 'INOUT' },
    out_params : ['NRO_DIG_VER'],
   }
 ];

  if(content.deleteCab.length !== 0){  
    // VERIFICA NRO_DOCUMETO
    var result = await validateBooleanFunction(content.updateInserData, VALIDA_NRO_DOCUMETO, req)  
    if(result.valor){
      res.json({'ret': 0,'p_mensaje':result.p_mensaje})
      return
    }    
  }

  let datosInsert = await generate_insert(req,'PERSONAS', content.updateInserData, {FEC_ALTA:'sysdate'});
  let datosUpdate = await generate_update(req,'PERSONAS', content.updateInserData, [content.aux_updateInserData]);
  let datosDelete = await generate_delete(req,'PERSONAS', content.deleteCab,{ cod_empresa, cod_usuario, direccion_ip, modulo:'BS', paquete:'eds_bsperson' }); 
 
  // console.log(datosInsert)
  // console.log(datosUpdate)
  // console.log(datosDelete)

  try {
  var sql =   `
          BEGIN
              :ret := EDS_BSPERSON.abm_bsperson ( :p_delete,
                                                  :p_update,
                                                  :p_insert,
                                                  --
                                                  :p_mensaje
                                                );
          END;`;
      const result  = await db.Open(sql,{
        p_delete  : datosDelete,
        p_update  : datosUpdate,
        p_insert  : datosInsert,
        // ---
        p_mensaje          : { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 300 },
        ret                : { dir: oracledb.BIND_OUT, type: oracledb.NUMBER, maxSize: 300 },
      }, true, req.headers.authuser, await crypto.decrypt(req.headers.authpass) );
      res.status(200).json(result.outBinds);
  } catch (error) {
    next();
    log_error.error(`abm_bsperson ${error}`)
    console.log("Error metodo feb_strempro",error);
  }
}