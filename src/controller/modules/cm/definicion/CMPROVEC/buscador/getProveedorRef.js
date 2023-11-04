const db          = require("../../../../../../connection/conn");
const oracledb    = require("oracledb");
const crypto      = require("../../../../../../utils/crypto");
const {log_error} = require('../../../../../../utils/logger');

exports.main = async (req, res, next)  => {
  const {valor}  = req.body;
  try {
      var sql =   ` select *
                      from (select c.cod_proveedor cod_proveedor_ref,
                                   p.nombre        desc_proveedor_ref
                              from cm_datos_proveedores c,
                                   personas p
                             where p.cod_persona   = c.cod_persona
                               and (c.cod_proveedor like '%' || :valor || '%' or upper(p.nombre) like '%' || upper(:valor) || '%' or :valor = 'null')
                          order by lpad(c.cod_proveedor, 10, '0') desc)
                  where rownum <= 50
                  `;
      var data = {valor};
      const response = await db.Open(sql,data,true,req.headers.authuser,await crypto.decrypt(req.headers.authpass));
      res.status(200).json(response);
    } catch (e) {
      log_error.error(`getProveedor | cmprovec ${e}`)
      console.log(e);
      next();
    }
  }