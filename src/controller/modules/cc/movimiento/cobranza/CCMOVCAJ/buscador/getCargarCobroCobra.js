const conexion    = require("../CONN/mainCon");
const oracledb    = require("oracledb");
const {log_error} = require('../../../../../../../utils/logger'   );


exports.main = async (req, res, next) => {
  const { COD_EMPRESA = '', COD_CLIENTE = '', TIP_COMPR_REF = '', NRO_COMPR_REF = '', COD_USUARIO = '', ID = '' } = req.body;

  let db;
  let resultSet;

  try {
    db = await conexion.conn(req);

    const result = await db.execute(
      `BEGIN
         :cursor := EDS_CCMOVCAJ.carga_cobro_cobranzas( :P_COD_EMPRESA
                                                      , :p_COD_CLIENTE
                                                      , :p_TIP_COMPR_REF
                                                      , :p_NRO_COMPR_REF
                                                      , :p_COD_USUARIO
                                                      , :P_ID
                                                      );
       END;`,
      {
        P_COD_EMPRESA  : COD_EMPRESA  ,
        p_COD_CLIENTE  : COD_CLIENTE  ,
        p_TIP_COMPR_REF: TIP_COMPR_REF,
        p_NRO_COMPR_REF: NRO_COMPR_REF,
        p_COD_USUARIO  : COD_USUARIO  ,
        P_ID           : ID           ,
        cursor: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR }
      }
    );

    console.log(COD_EMPRESA,'=', COD_CLIENTE,'=',TIP_COMPR_REF,'=',NRO_COMPR_REF,'=',COD_USUARIO);

    if (result.outBinds.p_mensaje) {
      return res.status(400).json({
        p_mensaje: result.outBinds.p_mensaje,
        ret: 0
      });
    }

    resultSet = result.outBinds.cursor;

    const rows = [];
    let row;

    while ((row = await resultSet.getRow())) {
      const processedRow = await Promise.all(
        row.map(async (value) => {
          if (value instanceof oracledb.Lob) {
            // Leer el contenido del Lob
            return await readLob(value);
          }
          return value; // Devolver el valor normal
        })
      );
      rows.push(processedRow);
    }
    let resp = { p_mensaje : '',
                 ret       : 1 ,
                 rows      : JSON.parse(rows)
               }
    res.status(200).json(resp);
  } catch (error) {
    log_error.error(`CCMOVCAJ getCargarCobroCobra ${error}`);
    console.error(error);

    res.status(500).json({
      message: 'Error interno en el servidor',
      error: error.message
    });

  } finally {
    if (resultSet) {
      try {
        await resultSet.close();
      } catch (err) {
        console.error('Error cerrando el cursor:', err);
      }
    }
    if (db) {
      try {
        await db.close();
      } catch (err) {
        console.error('Error cerrando la conexión:', err);
      }
    }
  }
};

// Función para leer el contenido de un Lob
async function readLob(lob) {
  return new Promise((resolve, reject) => {
    let data = '';
    lob.setEncoding('utf8'); // Establece la codificación para CLOB
    lob.on('data', (chunk) => {
      data += chunk;
    });
    lob.on('end', () => {
      resolve(data);
    });
    lob.on('error', (err) => {
      reject(err);
    });
  });
}




// exports.main = async (req, res, next) => {
//   let { COD_EMPRESA  = '',  COD_CLIENTE = '',TIP_COMPR_REF = '', NRO_COMPR_REF  = '', COD_USUARIO = '', ID = ''} = req.body;
//   try {
//     const db     = await conexion.conn(req)
//     const result = await db.execute(
//       `BEGIN
//          :cursor := EDS_CCMOVCAJ.carga_cobro_cobranzas(:P_COD_EMPRESA    ,
//                                                        :p_COD_CLIENTE    ,
//                                                        :p_TIP_COMPR_REF  , 
//                                                        :p_NRO_COMPR_REF  ,
//                                                        :p_COD_USUARIO    ,
//                                                        :P_ID             ,
//                                                        :p_mensaje       
//                                                       );
//        END;`,
//       { 
//         P_COD_EMPRESA    : COD_EMPRESA   ,
//         p_COD_CLIENTE    : COD_CLIENTE   ,
//         p_TIP_COMPR_REF  : TIP_COMPR_REF ,
//         p_NRO_COMPR_REF  : NRO_COMPR_REF ,
//         p_COD_USUARIO    : COD_USUARIO   ,
//         P_ID             : ID            ,
//         p_mensaje        : { dir : oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 300 },
//         cursor           : { dir : oracledb.BIND_OUT, type: oracledb.CURSOR  }
//       }
//     );

//     if(result.outBinds.p_mensaje == null){
//       const resultSet = result.outBinds.cursor;

//       let row;
//       let rows = [];
  
//       while ((row = await result.outBinds.cursor.getRow())) {
//         rows.push(row[0]);
//       }
    

//       let resp = { p_mensaje : '',
//                    ret       : 1 ,
//                    rows      : JSON.parse(rows[0])
//                   }
//       res.status(200).json(resp);

//       await resultSet.close();
//       await db.close();

//     }else{
//       let resp = { p_mensaje : result.outBinds.p_mensaje,
//                    ret       : 0
//                   }
//       res.status(200).json(resp);
//       await db.close();
//     }
//   } catch (error) {
//     log_error.error(`CCMOVCAJ getCargarCobroCobra ${error}`)
//     console.log(error)
//     next()
//   }
// }