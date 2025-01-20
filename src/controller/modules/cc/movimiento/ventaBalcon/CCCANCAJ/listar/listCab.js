const db          = require("../../../../../../../connection/conn");
const crypto      = require("../../../../../../../utils/crypto"   );
const {log_error} = require('../../../../../../../utils/logger'   );

exports.main = async (req, res, next) => {
  let { COD_EMPRESA     = '', COD_SUCURSAL    = '', TIP_COMP        = '', 
        NRO_COMPROBANTE = '', TIP_COMPROBANTE = '', FEC_COMPROBANTE = '', 
        COD_CLIENTE     = ''} = req.body;
    
  try {
    let sql = `select EDS_CCCANCAJ.listar_cabecera( :COD_EMPRESA
                                                  , :COD_SUCURSAL
                                                  , :TIP_COMP
                                                  , :NRO_COMPROBANTE
                                                  , :TIP_COMPROBANTE
                                                  , :FEC_COMPROBANTE
                                                  , :COD_CLIENTE
                                                 ) as data from dual`;
    let data = {  COD_EMPRESA    , COD_SUCURSAL
                , TIP_COMP       , NRO_COMPROBANTE
                , TIP_COMPROBANTE, FEC_COMPROBANTE
                , COD_CLIENTE};
    let result = await db.Open(sql,data,true,req.headers.authuser,await crypto.decrypt(req.headers.authpass));   
    result.rows = result.rows.shift().DATA;
    res.status(200).json( result );
  } catch (error) {
    log_error.error(`listar_cabecera | EDS_CCCANCAJ ${error}`)
    console.log(error);
    next();
  }
}