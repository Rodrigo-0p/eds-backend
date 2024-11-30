const db          = require("../../../../../../../connection/conn");
const crypto      = require("../../../../../../../utils/crypto"   );
const {log_error} = require('../../../../../../../utils/logger'   );

exports.main = async (req, res, next) => {
  let { COD_EMPRESA      = ''
     ,  COD_SUCURSAL     = ''
     ,  TIP_MOV_CAJ      = ''
     ,  SER_MOV_CAJ      = ''
     ,  NRO_MOV_CAJ      = ''
     ,  COD_MONEDA_COBRO = ''
     ,  COD_MODULO       = ''} = req.body;

  try {
    let sql = `select EDS_CCMOVCAJ.listar_detalle( :COD_EMPRESA
                                                 , :COD_SUCURSAL
                                                 , :TIP_MOV_CAJ
                                                 , :SER_MOV_CAJ
                                                 , :NRO_MOV_CAJ
                                                 , :COD_MODULO
                                                 , :COD_MONEDA_COBRO
                                                 ) as data from dual`;
    let data = {  COD_EMPRESA 
                , COD_SUCURSAL
                , TIP_MOV_CAJ
                , SER_MOV_CAJ
                , NRO_MOV_CAJ
                , COD_MODULO
                , COD_MONEDA_COBRO
              };
    let result = await db.Open(sql,data,true,req.headers.authuser,await crypto.decrypt(req.headers.authpass));   
    result.rows = result.rows.shift().DATA;
    res.status(200).json( result );
  } catch (error) {
    log_error.error(`listar_detalle | EDS_CCMOVCAJ ${error}`)
    console.log(error);
    next();
  }
}