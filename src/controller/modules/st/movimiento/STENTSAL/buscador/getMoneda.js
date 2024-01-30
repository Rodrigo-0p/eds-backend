const db          = require("../../../../../../connection/conn");
const oracledb    = require("oracledb");
const crypto      = require("../../../../../../utils/crypto");
const {log_error} = require('../../../../../../utils/logger');

exports.main = async (req, res, next)  => {
  var valor = req.body.valor;
  try {
        var sql = `  select s.cod_moneda,
                            s.descripcion desc_moneda,
                            s.decimales,
                            nvl(t.val_venta, 1) tip_cambio,
                            nvl(t.val_venta, 1) tip_cambio_us
                      from monedas s
                         , tipos_cambio t
                     where s.cod_moneda = t.cod_moneda(+)
                       and t.fec_tipo_cambio(+) = trunc(sysdate)
                       and (s.cod_moneda like '%' || :valor || '%' or upper(s.descripcion) like '%' || upper(:valor) || '%' or :valor = 'null')
                       and rownum <= 20
                     order by lpad(s.cod_moneda, 10, '0') asc`;
      var data = {valor};
      const response = await db.Open(sql,data,true,req.headers.authuser,await crypto.decrypt(req.headers.authpass));
      res.status(200).json(response);
    } catch (e) {
      log_error.error(`getMoneda | stentsal ${e}`)
      console.log(e);
      next();
    }
  }