const db          = require("../../../../../../../connection/conn");
const oracledb    = require("oracledb");
const crypto      = require("../../../../../../../utils/crypto");
const {log_error} = require('../../../../../../../utils/logger');

exports.main = async (req, res, next)  => {
  const {COD_EMPRESA = '', valor = null} = req.body

  try {
        var sql = `  select c.cod_cliente
                          , nvl( p.nombre, p.nomb_fantasia ) desc_cliente
                      from cc_clientes c
                         , personas    p
                     where c.cod_empresa =:COD_EMPRESA
                       and p.cod_persona = c.cod_persona
                       and (c.cod_cliente like '%' || :valor || '%' or 
                      upper(p.nombre)     like '%' || upper(:valor) || '%' or :valor = 'null')
                       and rownum <= 20
                     order by 1`;
      var data = {COD_EMPRESA,valor};
      const response = await db.Open(sql,data,true,req.headers.authuser,await crypto.decrypt(req.headers.authpass));
      res.status(200).json(response);
    } catch (e) {
      log_error.error(`getCliente | ccmovcaj ${e}`)
      console.log(e);
      next();
    }
  }