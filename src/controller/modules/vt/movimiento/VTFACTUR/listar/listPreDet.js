const db             = require("../../../../../../connection/conn");
const crypto         = require("../../../../../../utils/crypto");
const {log_error}    = require('../../../../../../utils/logger')

exports.main = async (req, res, next) => {
  let { COD_EMPRESA = '', SER_COMPROBANTE = '',TIP_COMPROBANTE = '',NRO_COMPROBANTE = ''} = req.body;
  
  try {
    let sql = `select eds_vtfactur.listar_det_presupuesto(:COD_EMPRESA
                                                        , :TIP_COMPROBANTE 
                                                        , :SER_COMPROBANTE 
                                                        , :NRO_COMPROBANTE) as data from dual`;

    let data = { COD_EMPRESA, TIP_COMPROBANTE,SER_COMPROBANTE,NRO_COMPROBANTE};


    console.log( data );

    let result = await db.Open(sql,data,true,req.headers.authuser,await crypto.decrypt(req.headers.authpass));       
    result.rows = result.rows.shift().DATA;
    res.status(200).json( result );
  } catch (error) {
    log_error.error(`listar_det_presupuesto | eds_vtfactur ${error}`)
    console.log(error);
    next();
  }
}