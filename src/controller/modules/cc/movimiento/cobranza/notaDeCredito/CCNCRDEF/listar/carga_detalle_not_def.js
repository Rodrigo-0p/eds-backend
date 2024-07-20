const db          = require("../../../../../../../../connection/conn");
const crypto      = require("../../../../../../../../utils/crypto"   );
const {log_error} = require('../../../../../../../../utils/logger'   );

exports.main = async (req, res, next) => {
  let { COD_EMPRESA  = '', TIP_COMPROBANTE_REF = '' , SER_COMPROBANTE_REF = '' , NRO_COMPROBANTE_REF = ''} = req.body;

  try {
    let sql = `select EDS_CCNCRDEF.carga_detalle_not_def( :COD_EMPRESA
                                                        , :TIP_COMPROBANTE_REF
                                                        , :SER_COMPROBANTE_REF
                                                        , :NRO_COMPROBANTE_REF
                                                        ) as data from dual`;
    let data = { COD_EMPRESA
              ,  TIP_COMPROBANTE_REF : 'FCO'
              ,  SER_COMPROBANTE_REF
              ,  NRO_COMPROBANTE_REF };
    let result = await db.Open(sql,data,true,req.headers.authuser,await crypto.decrypt(req.headers.authpass));   
    result.rows = result.rows.shift().DATA;
    res.status(200).json( result );
  } catch (error) {
    log_error.error(`carga_detalle_not_def | EDS_CCNCRDEF ${error}`)
    console.log(error);
    next();
  }
}