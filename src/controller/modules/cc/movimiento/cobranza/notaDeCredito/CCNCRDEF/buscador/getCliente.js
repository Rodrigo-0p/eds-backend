const db          = require("../../../../../../../../connection/conn");
const crypto      = require("../../../../../../../../utils/crypto");
const {log_error} = require('../../../../../../../../utils/logger');


exports.main = async (req, res, next)  => {
  const cod_empresa = req.body.cod_empresa;
  const {valor}     = req.body;

  try {
      var sql =   ` select s.cod_cliente
                         , s.nombre desc_cliente
                      from ccv_clientes s
                     where s.cod_empresa = :cod_empresa
                       and nvl(s.estado,'X') = 'A'
                       and (s.cod_cliente like '%' || :valor || '%' or
                      upper(s.nombre)     like '%' || upper(:valor) || '%' or :valor = 'null')
                       and rownum <= 20
                     order by lpad(s.cod_cliente, 10, '0') asc
                  `;
      var data = {cod_empresa,valor};
      const response = await db.Open(sql,data,true,req.headers.authuser,await crypto.decrypt(req.headers.authpass));
      res.status(200).json(response);
    } catch (e) {
      log_error.error(`getCliente | CCNCRDEF ${e}`)
      console.log(e);
      next();
    }
  }