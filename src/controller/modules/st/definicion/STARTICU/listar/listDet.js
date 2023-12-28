const db             = require("../../../../../../connection/conn");
const crypto         = require("../../../../../../utils/crypto");
const {log_error}    = require('../../../../../../utils/logger')

exports.main = async (req, res, next) => {
  let { COD_EMPRESA = '', COD_ARTICULO = ''} = req.body;
  
  try {
    let sql = `select EDS_STARTICU.listar_relaciones( :COD_EMPRESA, :COD_ARTICULO) as data from dual`;

    let data = { COD_EMPRESA, COD_ARTICULO};
    let result = await db.Open(sql,data,true,req.headers.authuser,await crypto.decrypt(req.headers.authpass));   
    result.rows = result.rows.shift().DATA;
    res.status(200).json( result );
  } catch (error) {
    log_error.error(`listar_relaciones | STARTICU ${error}`)
    console.log(error);
    next();
  }
}