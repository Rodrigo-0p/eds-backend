const db          = require("../../../../../../connection/conn");
const crypto      = require("../../../../../../utils/crypto");
const {log_error} = require('../../../../../../utils/logger');

exports.main = async (req, res, next)  => {
  const {cod_empresa,cod_sucursal = ''} = req.body;
  const {valor}                    = req.body;
  try {
      var sql =   `select cod_deposito
                        , descripcion desc_deposito
                        , rownum id
                    from st_depositos c
                    where cod_empresa        = :cod_empresa
                      and cod_sucursal       = :cod_sucursal
                      and nvl(activo,'N')    = 'S'
                      and nvl(ind_jaula,'N') = 'N'
                      and (       c.cod_deposito like '%' || :valor        || '%' or
                            upper(c.descripcion) like '%' || upper(:valor) || '%' or :valor = 'null'
                          )
                        and rownum <= 20
                      order by lpad(c.cod_deposito, 10, '0') asc`;
      var data = {cod_empresa,cod_sucursal,valor};
      const response = await db.Open(sql,data,true,req.headers.authuser,await crypto.decrypt(req.headers.authpass));
      res.status(200).json(response);
    } catch (e) {
      log_error.error(`getDeposito | CMFACTUR ${e}`)
      console.log(e);
      next();
    }
  }