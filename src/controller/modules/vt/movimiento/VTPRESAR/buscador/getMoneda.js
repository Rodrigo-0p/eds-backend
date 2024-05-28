const db          = require("../../../../../../connection/conn");
const crypto      = require("../../../../../../utils/crypto");
const {log_error} = require('../../../../../../utils/logger');

exports.main = async (req, res, next)  => {
  const {valor}       = req.body;
  try {
      var sql =   `select m.cod_moneda,
                          m.descripcion desc_moneda,
                          m.decimales,
                          m.tipo_cambio_dia tip_cambio                  
                    from monedas m
                    where (m.cod_moneda   like '%' || :valor || '%' or
                     upper(m.descripcion) like '%' || upper(:valor) || '%' or :valor = 'null')
                    order by m.cod_moneda`;
      var data = {valor};
      const response = await db.Open(sql,data,true,req.headers.authuser,await crypto.decrypt(req.headers.authpass));
      res.status(200).json(response);
    } catch (e) {
      log_error.error(`getMoneda | VTPRESAR ${e}`)
      console.log(e);
      next();
    }
  }