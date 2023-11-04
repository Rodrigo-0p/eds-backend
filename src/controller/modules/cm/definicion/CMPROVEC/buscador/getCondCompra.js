const db          = require("../../../../../../connection/conn");
const oracledb    = require("oracledb");
const crypto      = require("../../../../../../utils/crypto");
const {log_error} = require('../../../../../../utils/logger');

exports.main = async (req, res, next)  => {
  var valor       = req.body.valor;
  var cod_empresa = req.body.cod_empresa;

  try {
      var sql =   `select c.cod_condicion_compra,
                          c.descripcion desc_condicion_compra
                     from cm_condiciones_compras c
                    where c.cod_empresa = :cod_empresa
                      and (c.cod_condicion_compra like '%' || :valor || '%' or upper(c.descripcion) like '%' || upper(:valor) || '%' or :valor = 'null')
                    order by lpad(c.cod_condicion_compra, 10, '0') desc`;
      var data = {cod_empresa,valor};
      const response = await db.Open(sql,data,true,req.headers.authuser,await crypto.decrypt(req.headers.authpass));
      res.status(200).json(response);
    } catch (e) {
      log_error.error(`getCodCompra | cod_condicion_compra ${e}`)
      console.log(e);
      next();
    }
  }