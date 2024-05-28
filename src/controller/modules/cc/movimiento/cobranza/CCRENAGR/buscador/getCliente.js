const db          = require("../../../../../../../connection/conn");
const crypto      = require("../../../../../../../utils/crypto");
const {log_error} = require('../../../../../../../utils/logger');

exports.main = async (req, res, next)  => {
  const {cod_empresa} = req.body;
  const {valor}       = req.body;
  try {
      var sql =   `select c.cod_cliente
                        , c.nombre desc_cliente
                     from ccv_clientes c
                    where c.cod_empresa     =:cod_empresa
                      and nvl(c.estado,'X') = 'A'
                      and (c.cod_cliente like      '%' || :valor        || '%' or
                          upper(c.nombre) like '%' || upper(:valor) || '%' or :valor = 'null')
                      and rownum <= 20`;
      var data = {cod_empresa,valor};
      const response = await db.Open(sql,data,true,req.headers.authuser,await crypto.decrypt(req.headers.authpass));
      res.status(200).json(response);
    } catch (e) {
      log_error.error(`getCliente | CCRENAGR ${e}`)
      console.log(e);
      next();
    }
  }