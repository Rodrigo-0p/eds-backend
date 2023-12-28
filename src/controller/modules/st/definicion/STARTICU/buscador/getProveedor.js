const db          = require("../../../../../../connection/conn");
const crypto      = require("../../../../../../utils/crypto");
const {log_error} = require('../../../../../../utils/logger');

exports.main = async (req, res, next)  => {
  const cod_empresa = req.body.cod_empresa;
  const {valor}     = req.body;
  try {
      var sql =   ` select *
                      from (select c.cod_proveedor cod_proveedor_dflt,
                                   p.nombre        desc_proveedor
                              from cm_datos_proveedores c,
                                   personas p
                             where c.cod_empresa   =:cod_empresa
                               and p.cod_persona   = c.cod_persona
                               and (c.cod_proveedor like '%' || :valor || '%' or upper(p.nombre) like '%' || upper(:valor) || '%' or :valor = 'null')
                          order by lpad(c.cod_proveedor, 10, '0') desc)
                  where rownum <= 50
                  `;
      var data = {cod_empresa,valor};
      const response = await db.Open(sql,data,true,req.headers.authuser,await crypto.decrypt(req.headers.authpass));
      res.status(200).json(response);
    } catch (e) {
      log_error.error(`getProveedor | starticu ${e}`)
      console.log(e);
      next();
    }
  }