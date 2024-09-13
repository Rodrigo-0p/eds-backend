const db          = require("../../../../../../../connection/conn");
const crypto      = require("../../../../../../../utils/crypto");
const {log_error} = require('../../../../../../../utils/logger');


exports.main = async (req, res, next)  => {
  const cod_empresa = req.body.cod_empresa;
  const {valor}     = req.body;

  try {
      var sql =   `  select s.cod_moneda
                          , s.descripcion desc_moneda
                          , s.decimales
                          , retorna_tipo_cambio(s.tipo_cambio,'D',sysdate,'C') tip_cambio
                        from monedas s
                      where (s.cod_moneda like '%' || :valor || '%' or
                        upper(s.descripcion) like '%' || upper(:valor) || '%' or :valor = 'null')
                        and rownum <= 20
                      order by lpad(s.cod_moneda, 10, '0') asc
                  `;
      var data = {valor};
      const response = await db.Open(sql,data,true,req.headers.authuser,await crypto.decrypt(req.headers.authpass));
      res.status(200).json(response);
    } catch (e) {
      log_error.error(`getMonda | CCNCRDEF ${e}`)
      console.log(e);
      next();
    }
  }