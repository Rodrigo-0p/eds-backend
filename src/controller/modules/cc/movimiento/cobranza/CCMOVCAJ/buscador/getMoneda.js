const db          = require("../../../../../../../connection/conn");
const oracledb    = require("oracledb");
const crypto      = require("../../../../../../../utils/crypto");
const {log_error} = require('../../../../../../../utils/logger');

exports.main = async (req, res, next)  => {
  var valor          = req.body.valor;
  const {fec_mov_caj = 'sysdate'} = req.body
  try {
        var sql = `  select s.cod_moneda,
                            s.descripcion desc_moneda,
                            retorna_tipo_cambio(s.cod_moneda,'D',to_date('${fec_mov_caj}','DD/MM/YYYY'),'C') tip_cambio
                      from monedas s
                     where (s.cod_moneda like '%' || :valor || '%' or upper(s.descripcion) like '%' || upper(:valor) || '%' or :valor = 'null')
                       and rownum <= 20
                     order by lpad(s.cod_moneda, 10, '0') asc`;
      var data = {valor};
      const response = await db.Open(sql,data,true,req.headers.authuser,await crypto.decrypt(req.headers.authpass));
      res.status(200).json(response);
    } catch (e) {
      log_error.error(`getMoneda | ccmovcaj ${e}`)
      console.log(e);
      next();
    }
  }