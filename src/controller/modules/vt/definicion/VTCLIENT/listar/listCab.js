const db             = require("../../../../../../connection/conn");
const crypto         = require("../../../../../../utils/crypto");
const {log_error} = require('../../../../../../utils/logger')

exports.main = async (req, res, next) => {
  let { COD_EMPRESA         = '', COD_CLIENTE         = '' , COD_PERSONA         = '',
        COD_MONEDA_LIMITE   = '', COD_CONDICION_VENTA = '',
        COD_CAUSAL          = '', COD_GRUPO_CLIENTE,
        INDICE , LIMITE } = req.body;
  try {
    let sql = `select EDS_VTCLIENT.listar_cabecera( :COD_EMPRESA
                                                  , :COD_CLIENTE
                                                  , :COD_PERSONA
                                                  , :COD_MONEDA_LIMITE                                                
                                                  , :COD_CONDICION_VENTA
                                                  , :COD_CAUSAL
                                                  , :COD_GRUPO_CLIENTE
                                                  , :INDICE
                                                  , :LIMITE 
                                                ) as data from dual`;

    let data = { COD_EMPRESA
               , COD_CLIENTE
               , COD_PERSONA
               , COD_MONEDA_LIMITE
               , COD_CONDICION_VENTA
               , COD_CAUSAL
               , COD_GRUPO_CLIENTE
               , INDICE
               , LIMITE};
                 
    let result = await db.Open(sql,data,true,req.headers.authuser,await crypto.decrypt(req.headers.authpass));   
    result.rows = result.rows.shift().DATA;
    res.status(200).json( result );
  } catch (error) {
    log_error.error(`listar_cliente | vtclient ${error}`)
    console.log(error);
    next();
  }
}