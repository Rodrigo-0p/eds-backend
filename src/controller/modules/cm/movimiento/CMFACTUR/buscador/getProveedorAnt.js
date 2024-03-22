const db          = require("../../../../../../connection/conn");
const crypto      = require("../../../../../../utils/crypto");
const {log_error} = require('../../../../../../utils/logger');

exports.main = async (req, res, next)  => {
  let cod_empresa = req.body.cod_empresa;
  const {valor}   = req.body;
  try {
      var sql =   ` select *
                      from ( select v.cod_proveedor cod_proveedor_ant,
                                    ltrim(p.nombre) desc_proveedor_ant,
                                    rownum id
                               from personas p
                                  , cm_datos_proveedores v
                              where v.cod_empresa = :cod_empresa
                                and v.cod_persona = p.cod_persona
                                and nvl(estado, 'A') = 'A'
                                and (v.cod_proveedor like '%' || :valor || '%' or
                                    upper(v.cod_proveedor) like '%' || upper(:valor) || '%' or
                                    :valor = 'null' or p.nombre like '%' || :valor || '%' or
                                    upper(p.nombre) like '%' || upper(:valor) || '%' or
                                    :valor = 'null')
                              order by lpad(v.cod_proveedor, 10, '0') asc)
                       where rownum <= 20
                  `;
      var data = {cod_empresa,valor};
      const response = await db.Open(sql,data,true,req.headers.authuser,await crypto.decrypt(req.headers.authpass));
      res.status(200).json(response);
    } catch (e) {
      log_error.error(`getProveedorAnt | cmfactur ${e}`)
      console.log(e);
      next();
    }
  }