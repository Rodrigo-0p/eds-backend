const db             = require("../../../../../../connection/conn");
const crypto         = require("../../../../../../utils/crypto");
const {log_error}    = require('../../../../../../utils/logger')

exports.main = async (req, res, next) => {
  let { COD_EMPRESA = '', NRO_ENT_SAL = ''} = req.body;
  
  try {
    let sql = `select EDS_STENTSAL.listar_detalle( :COD_EMPRESA, :NRO_ENT_SAL) as data from dual`;

    let data = { COD_EMPRESA, NRO_ENT_SAL};
    let result = await db.Open(sql,data,true,req.headers.authuser,await crypto.decrypt(req.headers.authpass));   
    result.rows = result.rows.shift().DATA;
    res.status(200).json( result );
  } catch (error) {
    log_error.error(`listar_relaciones | EDS_STENSAL ${error}`)
    console.log(error);
    next();
  }
}