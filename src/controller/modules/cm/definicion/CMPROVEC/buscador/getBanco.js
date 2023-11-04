const db          = require("../../../../../../connection/conn");
const oracledb    = require("oracledb");
const crypto      = require("../../../../../../utils/crypto");
const {log_error} = require('../../../../../../utils/logger');

exports.main = async (req, res, next)  => {
  var valor = req.body.valor;
  try {
        var sql = `  select c.cod_banco
                          , c.codigo_swift desc_banco
                       from cc_codigo_bancario c
                      where c.activo = 'S'
                        and (c.cod_banco like '%' || :valor || '%' or upper(c.codigo_swift) like '%' || upper(:valor) || '%' or :valor = 'null')
                        and rownum <= 20
                      order by lpad(c.cod_banco, 10, '0') desc  
                  `;
      var data = {valor};
      const response = await db.Open(sql,data,true,req.headers.authuser,await crypto.decrypt(req.headers.authpass));
      res.status(200).json(response);
    } catch (e) {
      log_error.error(`getBanco | cmprovec ${e}`)
      console.log(e);
      next();
    }
  }