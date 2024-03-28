const oracledb                  = require("oracledb");
const db                        = require("../../../../../connection/conn"              );
const crypto                    = require("../../../../../utils/crypto"                 );
const tableData                 = require('./tableDate');
const { log_error}              = require('../../../../../utils/logger'                 );
const { generate_update }       = require('../../../../../utility/generate_update'  );


exports.main = async(req, res, next)=>{
  var content    = req.body;
  let auditoria  = content.aditionalData[0] 

  // CAB
  let NameTableCab = 'CM_COMPRAS_CABECERA';
	let tableCab     = tableData.find( item => item.table === NameTableCab);
  let datosUpdat   = await generate_update(NameTableCab, content.update_cab, content.aux_update_cab,{},{FEC_ESTADO:'sysdate', COD_USU_ESTADO:`'${auditoria.cod_usuario}'`}, tableCab.column,  tableCab.pk);

  try {
  var sql =   `
          BEGIN
              :ret := eds_cmcoffac.abm_cmcoffac ( :p_update  ,
                                                  :p_mensaje
                                                );
          END;`;
      const result  = await db.Open(sql,{
        p_update    : datosUpdat,
        p_mensaje   : { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 300 },
        ret         : { dir: oracledb.BIND_OUT, type: oracledb.NUMBER, maxSize: 300 },
      }, true, req.headers.authuser, await crypto.decrypt(req.headers.authpass) );

    res.status(200).json(result.outBinds ? result.outBinds : {p_mensaje:result.message});
  } catch (error) {
    next();
    log_error.error(`eds_cmcoffac : ${result}`)
    res.status(200).json({error})
  }
}