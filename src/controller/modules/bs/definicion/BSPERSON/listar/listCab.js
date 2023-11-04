const db             = require("../../../../../../connection/conn");
const crypto         = require("../../../../../../utils/crypto");
const {log_error} = require('../../../../../../utils/logger')

exports.main = async (req, res, next) => {
  let { COD_PERSONA   , NOMBRE        , NOMB_FANTASIA, 
        TIPO_SOCIEDAD , COD_SECTOR    , COD_PAIS     ,
        COD_PROVINCIA , COD_CIUDAD    , COD_BARRIO   ,
        COD_IDENT     , NRO_DOCUMENTO , NRO_DIG_VER  ,
        ES_FISICA     , INDICE        , LIMITE   } = req.body;  
  var NOMBRE_PER         = '';
  var NOMB_FANTASIA_PER  = '';
  if(NOMBRE        !== '' && NOMBRE        !== null && NOMBRE        !== undefined ) NOMBRE_PER        = '%' + NOMBRE.replace(' ', '%') + '%'; 
  if(NOMB_FANTASIA !== '' && NOMB_FANTASIA !== ''   && NOMB_FANTASIA !== undefined ) NOMB_FANTASIA_PER = '%' + NOMB_FANTASIA.replace(' ', '%') + '%'; 


  try {
    let sql = `select EDS_BSPERSON.listar_cabecera( :COD_PERSONA
                                                  , :NOMBRE_PER
                                                  , :NOMB_FANTASIA_PER
                                                  , :TIPO_SOCIEDAD 
                                                  , :COD_SECTOR    
                                                  , :COD_PAIS
                                                  , :COD_PROVINCIA 
                                                  , :COD_CIUDAD 
                                                  , :COD_BARRIO
                                                  , :COD_IDENT
                                                  , :NRO_DOCUMENTO 
                                                  , :NRO_DIG_VER
                                                  , :ES_FISICA
                                                  , :INDICE
                                                  , :LIMITE
                                                ) as data from dual`;

    let data = { COD_PERSONA   , NOMBRE_PER    , NOMB_FANTASIA_PER,
                 TIPO_SOCIEDAD , COD_SECTOR    , COD_PAIS         ,
                 COD_PROVINCIA , COD_CIUDAD    , COD_BARRIO       ,
                 COD_IDENT     , NRO_DOCUMENTO , NRO_DIG_VER      ,
                 ES_FISICA     ,
                 INDICE,LIMITE};
    let result = await db.Open(sql,data,true,req.headers.authuser,await crypto.decrypt(req.headers.authpass));   
    result.rows = result.rows.shift().DATA;
    res.status(200).json( result );
  } catch (error) {
    log_error.error(`listar_referencia | strempro ${error}`)
    console.log(error);
    next();
  }
}