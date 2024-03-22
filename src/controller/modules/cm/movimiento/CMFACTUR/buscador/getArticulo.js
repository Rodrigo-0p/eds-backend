const db          = require("../../../../../../connection/conn");
const crypto      = require("../../../../../../utils/crypto");
const {log_error} = require('../../../../../../utils/logger');

exports.main = async (req, res, next)  => {

  let cod_proveedor = req.body.dependencia[3] ? req.body.dependencia[3].COD_PROVEEDOR : ''
  let cod_empresa = req.body.cod_empresa;
  const {valor}     = req.body;
  try {
      var sql =   ` select *
                      from (   select  a.codigo cod_articulo
                                    ,  a.descripcion desc_articulo
                                    ,  a.cod_unidad_rel cod_unidad_medida
                                    ,  a.referencia desc_unidad_medida
                                    ,  'S' mismoprov
                                    ,  a.codigo || '-' || a.referencia id
                                from cmc_listado_articulo_prov a
                                where a.cod_empresa   = :cod_empresa
                                  and a.cod_proveedor = :cod_proveedor
                                  and ( a.codigo         like '%' || :VALOR || '%' or upper(a.descripcion) like '%' || upper(:VALOR) || '%' or :VALOR = 'null' or
                                        a.cod_unidad_rel like '%' || :VALOR || '%' or upper(a.referencia)  like '%' || upper(:VALOR) || '%' or :VALOR = 'null'
                                      )
                                  order by lpad(a.codigo, 10, '0') asc
                                )
                        where rownum <= 20
                  `;
      var data = {cod_empresa,cod_proveedor,valor};
      const response = await db.Open(sql,data,true,req.headers.authuser,await crypto.decrypt(req.headers.authpass));
      res.status(200).json(response);
    } catch (e) {
      log_error.error(`getArticulo | cmfactur ${e}`)
      console.log(e);
      next();
    }
  }