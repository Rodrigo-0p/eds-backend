const db          = require("../../../../../../connection/conn");
const oracledb    = require("oracledb");
const crypto      = require("../../../../../../utils/crypto");
const {log_error} = require('../../../../../../utils/logger');

exports.main = async (req, res, next)  => {
  var valor       = req.body.valor;
  var cod_empresa = req.body.cod_empresa;

  try {
      var sql =   ` select c.cod_cuenta    cod_cuenta_cont,
                           c.nombre_cuenta desc_cuenta_ref
                      from co_plan_cuentas_prov c
                     where c.cod_empresa = :cod_empresa
                       and nvl(c.asentable, 'N') = 'S'
                       and (c.cod_cuenta like '%' || :valor || '%' or upper(c.nombre_cuenta) like '%' || upper(:valor) || '%' or :valor = 'null')
                       and  rownum <= 50
                      order by lpad(c.cod_cuenta, 10, '0') desc
                  `;
      var data = {cod_empresa,valor};
      const response = await db.Open(sql,data,true,req.headers.authuser,await crypto.decrypt(req.headers.authpass));
      res.status(200).json(response);
    } catch (e) {
      log_error.error(`getPersona | cmprovec ${e}`)
      console.log(e);
      next();
    }
  }