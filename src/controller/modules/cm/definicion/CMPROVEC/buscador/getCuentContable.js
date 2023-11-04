const db          = require("../../../../../../connection/conn");
const oracledb    = require("oracledb");
const crypto      = require("../../../../../../utils/crypto");
const {log_error} = require('../../../../../../utils/logger');

exports.main = async (req, res, next)  => {

  var valor       = req.body.valor;
  var cod_empresa = req.body.cod_empresa;

  try {
      var sql =   ` select *
                      from (select  c.cod_cuenta cod_cuenta_contable
                                  , c.nombre_cuenta desc_cuenta_contable
                              from  co_plan_cuentas c
                              where c.cod_empresa =:cod_empresa and c.asentable = 'S'
                                and (c.cod_cuenta like '%' || :valor || '%' or upper(c.nombre_cuenta) like '%' || upper(:valor) || '%' or :valor = 'null')
                              order by lpad(c.cod_cuenta, 10, '0') desc)
                              where rownum <= 50
                  `;
      var data = {cod_empresa,valor};
      const response = await db.Open(sql,data,true,req.headers.authuser,await crypto.decrypt(req.headers.authpass));
      res.status(200).json(response);
    } catch (e) {
      log_error.error(`getCuentaContable | cmprovec ${e}`)
      console.log(e);
      next();
    }
  }