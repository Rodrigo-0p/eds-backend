const db          = require("../../../connection/conn");
const oracledb    = require("oracledb");
const crypto      = require("../../../utils/crypto");
const {log_error} = require('../../../utils/logger');

exports.main = async (req, res, next) => {
  const {cod_empresa,cod_usuario} = req.body;
  try {
     var sql = ` select  c.cod_empresa codigo
                      ,  c.descripcion descripcion
                      ,  c.ruta_logo
                      , 'EMP' id
                   from  empresas c
                      ,  bs_usuarios u
                  where (c.cod_empresa = :cod_empresa or :cod_empresa is null)
                    and (u.cod_usuario = :cod_usuario or :cod_usuario is null)
                    and  c.cod_empresa = u.cod_empresa
                  order by lpad(c.cod_empresa,'',12) desc`;
    
    var data = {cod_empresa,cod_usuario};
    const response = await db.Open(sql,data,true,req.headers.authuser,await crypto.decrypt(req.headers.authpass));
    res.status(200).json(response);
  } catch (e) {
    log_error.error(`getEmpresa | bsPublic ${e}`)
    console.log(e);
    next();
  }
}