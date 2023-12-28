const oracledb                  = require("oracledb");
const db                        = require("../../../../../connection/conn"              );
const crypto                    = require("../../../../../utils/crypto"                 );
const { log_error}              = require('../../../../../utils/logger'                 );
const { generate_delete }       = require('../../../../../utils/generate_delete_script' );
const { generate_update }       = require('../../../../../utils/generate_update_script' );
const { generate_insert }       = require('../../../../../utils/generate_insert_script' );
const {validateBooleanFunction} = require('../../../../../utils/validate'               );


exports.get_cod_list_pre  = async (req, res, next) => {
  const {cod_empresa,cod_sucursal} = req.params;
  try {
    var sql = `select nvl(max(to_number(c.cod_lista_precio)), 0) + 1 id
                 from vt_precios_fijos_cab c
                where c.cod_empresa  =:cod_empresa
                  and c.cod_sucursal =:cod_sucursal`;
  const response = await db.Open(sql,{cod_empresa,cod_sucursal},true,req.headers.authuser,await crypto.decrypt(req.headers.authpass));
  res.status(200).json(response);
  } catch (error) {
    console.log(error);
    log_error.error(`get_cod_list_pre ${error}`)
    next();
  }
}

exports.main = async(req, res, next)=>{
  var content      = req.body;
  const ip         = req.headers['cf-connecting-ip'] || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  var direccion_ip = ip.replace("::ffff:","");
  var cod_usuario  = content.AditionalData[0].cod_usuario;
  var cod_empresa  = content.AditionalData[0].cod_empresa;
  
  var VALIDA_CAB = [{
			campo			 : 'COD_MONEDA'   ,
			paquete		 : 'EDS_VTLISPRE.',
			funcion		 : 'VALIDA_MONEDA',
			in_params  : ['COD_MONEDA'] ,
      out_params : [ 'DESC_MONEDA'
                   , 'DECIMALES'
                   , 'TIP_CAMBIO'
                   ],
      out_type   : { DECIMALES: 'NUMBER','TIP_CAMBIO':'NUMBER'},
		}
  ]

  var VALIDA_DET = [
    {
			campo			 : 'COD_EMPRESA'    ,
			paquete		 : 'EDS_VTLISPRE.'  ,
			funcion		 : 'VALIDA_ARTICULO',
			in_params  : ['COD_EMPRESA', 'COD_ARTICULO'],
      out_params : ['DESC_ARTICULO'],
		},
    {
			campo			 : 'COD_UNIDAD_MEDIDA'  ,
			paquete		 : 'EDS_VTLISPRE.'   		,
			funcion		 : 'VALIDA_UM'					,
			in_params  : ['COD_EMPRESA', 'COD_ARTICULO', 'COD_UNIDAD_MEDIDA']     	 	,
      out_params : ['DESC_UNIDAD_MEDIDA'],
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


  let datosInsertCab = await generate_insert(req,'VT_PRECIOS_FIJOS_CAB', content.updateInserData,{FEC_ALTA:'sysdate',COD_USUARIO_ALTA:`'${cod_usuario}'`});
  let datosUpdateCab = await generate_update(req,'VT_PRECIOS_FIJOS_CAB', content.updateInserData, [content.aux_updateInserData],{FEC_MODI:'sysdate', COD_MODI:`'${cod_usuario}'`});
  let datosDeleteCab = await generate_delete(req,'VT_PRECIOS_FIJOS_CAB', content.delete_cab,{ cod_empresa, cod_usuario, direccion_ip, modulo:'VT', paquete:'eds_vtlispre' }); 
 
  let datosInsertDet = await generate_insert(req,'VT_PRECIOS_FIJOS_DET', content.updateInserDataDet,{});
  let datosUpdateDet = await generate_update(req,'VT_PRECIOS_FIJOS_DET', content.updateInserDataDet, content.aux_updateInserDataDet,{ COD_ARTICULO:'COD_ARTICULO_ANT', COD_UNIDAD_MEDIDA:'COD_UNIDAD_MEDIDA_ANT'});
  let datosDeleteDet = await generate_delete(req,'VT_PRECIOS_FIJOS_DET', content.delete_Det,{ cod_empresa, cod_usuario, direccion_ip, modulo:'VT', paquete:'eds_vtlispre' }); 

  // console.log('==>',datosInsertCab)
  // console.log('==>',datosUpdateCab)
  // console.log('==>',datosDeleteCab)

  // console.log('==>',datosInsertDet)
  // console.log('==>',datosUpdateDet)
  // console.log('==>',datosDeleteDet)

  // return
  try {
  var sql =   `
          BEGIN
              :ret := EDS_VTLISPRE.abm_vtlispre ( :p_deleteCab,
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
    log_error.error(`abm_vtlispre ${error}`)
    console.log("Error metodo EDS_VTLISPRE",error);
  }
}