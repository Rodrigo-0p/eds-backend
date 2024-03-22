const db          = require("../../../../../../connection/conn");
const crypto      = require("../../../../../../utils/crypto");
const {log_error} = require('../../../../../../utils/logger');

exports.main = async (req, res, next)  => {

  var cod_articulo = req.body.dependencia[1].COD_ARTICULO
  let cod_empresa  = req.body.cod_empresa;
  const {valor}    = req.body;

  try {
      var sql =   ` select *
                      from (   select p.cod_proveedor cod_proveedor_rec
                                    , p.desc_proveedor desc_proveedor_rec
                                    , p.cod_empresa ||' '|| p.cod_articulo id
                                  from cmv_proveedores_articulos p
                                where p.cod_empresa  = :cod_empresa 
                                  and p.cod_articulo = :cod_articulo
                                  and (          p.cod_proveedor   like '%' || :VALOR        || '%' 
                                        or upper(p.desc_proveedor) like '%' || upper(:VALOR) || '%' 
                                        or :VALOR = 'null'
                                      )
                                order by lpad(p.cod_proveedor, 10, '0') asc
                              )
                          where rownum <= 20
                  `;
      var data = {cod_empresa,cod_articulo,valor};
      const response = await db.Open(sql,data,true,req.headers.authuser,await crypto.decrypt(req.headers.authpass));
      res.status(200).json(response);
    } catch (e) {
      log_error.error(`getProveRec | cmfactur ${e}`)
      console.log(e);
      next();
    }
  }