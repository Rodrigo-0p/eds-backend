const db          = require("../../../../../../../connection/conn");
const crypto      = require("../../../../../../../utils/crypto"   );
const {log_error} = require('../../../../../../../utils/logger'   );

exports.main = async (req, res, next) => {
  let { COD_EMPRESA  = '', TIP_MOV_CAJ= '', SER_MOV_CAJ= '', NRO_MOV_CAJ= '', NRO_COMPROBANTE = '', COD_MONEDA_CAB = ''} = req.body;
  try {
    let sql = `select EDS_CCMOVCAJ.listar_refencia( :COD_EMPRESA
                                                  , :TIP_MOV_CAJ
                                                  , :SER_MOV_CAJ
                                                  , :NRO_MOV_CAJ
                                                  , :NRO_COMPROBANTE
                                                 ) as data from dual`;
    let data = {  COD_EMPRESA 
                , TIP_MOV_CAJ
                , SER_MOV_CAJ
                , NRO_MOV_CAJ
                , NRO_COMPROBANTE
              };
    let result = await db.Open(sql,data,true,req.headers.authuser,await crypto.decrypt(req.headers.authpass));   
    result.rows = result.rows.shift().DATA;
    res.status(200).json( result );
  } catch (error) {
    log_error.error(`listar_referencia | EDS_CCMOVCAJ ${error}`)
    console.log(error);
    next();
  }
}