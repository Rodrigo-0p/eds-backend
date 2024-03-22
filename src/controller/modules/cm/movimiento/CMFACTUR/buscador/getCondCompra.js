const db          = require("../../../../../../connection/conn");
const crypto      = require("../../../../../../utils/crypto");
const {log_error} = require('../../../../../../utils/logger');

exports.main = async (req, res, next)  => {
  const cod_empresa = req.body.cod_empresa;
  const {valor}     = req.body;
  try {
      var sql =   `select c.cod_condicion_compra,
                          c.descripcion desc_condicion_compra,
                          c.plazo,
                          c.rowid id
                    from cm_condiciones_compras c
                   where nvl(c.estado,'X') = 'A'
                     and c.cod_empresa =:cod_empresa
                     and (      c.cod_condicion_compra like '%' || :valor        || '%' or
                          upper(c.descripcion)         like '%' || upper(:valor) || '%' or :valor = 'null'
                          )
                     and rownum <= 20
                   order by lpad(c.cod_condicion_compra, 10, '0') asc
                  `;
      var data = {cod_empresa,valor};
      const response = await db.Open(sql,data,true,req.headers.authuser,await crypto.decrypt(req.headers.authpass));
      res.status(200).json(response);
    } catch (e) {
      log_error.error(`getCondCompra | cmfactur ${e}`)
      console.log(e);
      next();
    }
  }