const db             = require("../../../../../../connection/conn");
const crypto         = require("../../../../../../utils/crypto");
const {log_error} = require('../../../../../../utils/logger')

exports.main = async (req, res, next) => {
  let { COD_EMPRESA = '', COD_SUCURSAL = '' ,COD_LISTA_PRECIO = ''} = req.body;
  
  try {
    let sql = `select EDS_VTLISPRE.listar_detalle( :COD_EMPRESA, :COD_SUCURSAL, :COD_LISTA_PRECIO) as data from dual`;

    let data = { COD_EMPRESA,COD_SUCURSAL, COD_LISTA_PRECIO};
    let result = await db.Open(sql,data,true,req.headers.authuser,await crypto.decrypt(req.headers.authpass));   
    result.rows = result.rows.shift().DATA;
    res.status(200).json( result );
  } catch (error) {
    log_error.error(`listar_detalle | vtlispre ${error}`)
    console.log(error);
    next();
  }
}