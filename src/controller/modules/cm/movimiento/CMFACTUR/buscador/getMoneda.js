const db          = require("../../../../../../connection/conn");
const crypto      = require("../../../../../../utils/crypto");
const {log_error} = require('../../../../../../utils/logger');

exports.main = async (req, res, next)  => {
  const {cod_empresa,cod_sucursal = ''} = req.body;
  const {valor}                    = req.body;
  try {
      var sql =   `select m.cod_moneda,
                          m.descripcion desc_moneda,
                          m.decimales,
                          m.tipo_cambio_dia tip_cambio,
                          m.siglas,
                          m.rowid id
                    from monedas m, st_monedas_sucursal s
                    where s.cod_empresa  = :cod_empresa
                      and s.cod_sucursal = :cod_sucursal
                      and (m.cod_moneda like '%' || :valor || '%' or
                          upper(m.descripcion) like '%' || upper(:valor) || '%' or :valor = 'null')
                      and m.cod_moneda = s.cod_moneda
                    order by m.cod_moneda`;
      var data = {cod_empresa,cod_sucursal,valor};
      const response = await db.Open(sql,data,true,req.headers.authuser,await crypto.decrypt(req.headers.authpass));
      res.status(200).json(response);
    } catch (e) {
      log_error.error(`getMoneda | CMFACTUR ${e}`)
      console.log(e);
      next();
    }
  }