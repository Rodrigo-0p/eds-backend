const oracledb                  = require("oracledb");
const db                        = require("../../../../../connection/conn"              );
const crypto                    = require("../../../../../utils/crypto"                 );
const { log_error}              = require('../../../../../utils/logger'                 );
const { generate_delete }       = require('../../../../../utils/generate_delete_script' );
const { generate_update }       = require('../../../../../utils/generate_update_script' );
const { generate_insert }       = require('../../../../../utils/generate_insert_script' );
const {validateBooleanFunction} = require('../../../../../utils/validate'               );


exports.get_cod_persona  = async (req, res, next) => {
  var cod_empresa = req.params.cod_empresa;
  try {
    var sql = `select nvl(max(to_number(c.cod_proveedor)), 0) + 1 id
                 from cm_datos_proveedores c
                where c.cod_empresa =:cod_empresa`;
  const response = await db.Open(sql,{cod_empresa},true,req.headers.authuser,await crypto.decrypt(req.headers.authpass));
  res.status(200).json(response);
  } catch (error) {
    console.log(error);
    log_error.error(`get_cod_proveedor ${error}`)
    next();
  }
}

exports.abm = async(req, res, next)=>{
  var content      = req.body;
  const ip         = req.headers['cf-connecting-ip'] || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  var direccion_ip = ip.replace("::ffff:","");
  var cod_usuario  = content.AditionalData.cod_usuario;
  var cod_empresa  = content.AditionalData.cod_empresa;

  var VALIDA = [
    {
      campo			 : 'COD_CONDICION_COMPRA'    ,
      paquete		 : 'EDS_CMPROVEC.'  				 ,
      funcion		 : 'VALIDA_CONDICION_COMPRA' ,
      in_params  : ['COD_EMPRESA','COD_CONDICION_COMPRA'],
      out_params : ['DESC_CONDICION_COMPRA']  ,
    },{
      campo			 : 'COD_MONEDA'              ,
      paquete		 : 'EDS_CMPROVEC.'           ,
      funcion		 : 'VALIDA_MONEDAS'          ,
      in_params  : ['COD_MONEDA']            ,
      out_params : ['DESC_MONEDA']           ,
    },
    {
      campo			 : 'CANT_DIA_ANT'            ,
      paquete		 : 'EDS_CMPROVEC.'           ,
      funcion		 : 'VALIDA_LIMITE_REND'      ,
      in_params  : ['MODIFICA_DIAS_ANT'
                   ,'CANT_DIA_ANT']          ,
      out_params : [] ,
      bind_type  : {'CANT_DIA_ANT':'INOUT' } ,
    },
  ]

  if(!content.exitInsertedBand){
    VALIDA = [...VALIDA,
      // {
      //   campo			 : 'COD_BANCO'             ,
      //   paquete		 : 'EDS_CMPROVEC.'         ,
      //   funcion		 : 'VALIDA_BANCO'          ,
      //   in_params  : ['COD_BANCO']           ,
      //   out_params : ['DESC_BANCO']          ,
      // },
      // {
      // 	campo			 : 'COD_CUENTA_CONT'       ,
			//   paquete		 : 'EDS_CMPROVEC.'         ,
			//   funcion		 : 'VALIDA_CUENT_CONT'     ,
			//   in_params  : ['COD_EMPRESA'
      //                ,'COD_CUENTA_CONT']     ,
      //   out_params : ['DESC_CUENTA_REF']     ,
      // },{
      //   campo			 : 'COD_CUENT_CONTABLE'     ,
      //   paquete		 : 'EDS_CMPROVEC.'  				,
      //   funcion		 : 'VALIDA_CUENT_CONTABLE'  ,
      //   in_params  : ['COD_EMPRESA','COD_CUENTA_CONTABLE'],
      //   out_params : ['DESC_CUENTA_CONTABLE'] ,
      // }
    ];
  }

  if(content.deleteCab.length === 0){  
    var result = await validateBooleanFunction(content.updateInserData, VALIDA, req)
    if(result.valor){
      res.json({'ret': 0,'p_mensaje':result.p_mensaje})
      return
    }    
  }
  
  let datosInsert = await generate_insert(req,'CM_DATOS_PROVEEDORES', content.updateInserData, {COD_USUARIO:`'${cod_usuario}'`, FEC_ALTA:'sysdate'});
  let datosUpdate = await generate_update(req,'CM_DATOS_PROVEEDORES', content.updateInserData, content.aux_updateInserData);
  let datosDelete = await generate_delete(req,'CM_DATOS_PROVEEDORES', content.deleteCab,{ cod_empresa, cod_usuario, direccion_ip, modulo:'CM', paquete:'eds_cmprovec' }); 
 
  try {
  var sql =   `
          BEGIN
              :ret := EDS_CMPROVEC.abm_cmprovec ( :p_delete,
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