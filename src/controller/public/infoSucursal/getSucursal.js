const db          = require("../../../connection/conn");
const oracledb    = require("oracledb");
const crypto      = require("../../../utils/crypto");
const {log_error} = require('../../../utils/logger');

exports.main = async (req, res, next) => {
  const {cod_empresa} = req.body;
  try {
     var sql = `   select c.cod_sucursal codigo
                        , c.descripcion  descripcion
                        , e.cod_empresa
                        , e.descripcion desc_empresa
                        , e.ruta_logo
                        , 'SUC' id
                      from sucursales c
                        , empresas e
                    where c.cod_empresa = e.cod_empresa
                      and c.cod_empresa = :cod_empresa
                      and nvl(c.estado, 'I') = 'A'
                    order by lpad(c.cod_sucursal, 10, '0')`;
    
    var data = {cod_empresa};
    const response = await db.Open(sql,data,true,req.headers.authuser,await crypto.decrypt(req.headers.authpass));
    res.status(200).json(response);
  } catch (e) {
    log_error.error(`getSucursal | Public ${e}`)
    console.log(e);
    next();
  }
}