const db          = require("../../../../../../connection/conn");
const crypto      = require("../../../../../../utils/crypto");
const {log_error} = require('../../../../../../utils/logger');
const _           = require('underscore');

exports.main = async (req, res, next)  => {
  let p_cod_empresa  = req.body.cod_empresa;  
  let dependencia    =  _.extend( ...req.body.dependencia );
  let p_cod_sucursal = dependencia.COD_SUCURSAL  ? dependencia.COD_SUCURSAL : '';
  const {valor}      = req.body;

  try {
      var sql =   `select l.cod_articulo
                        , a.descripcion desc_articulo
                        , l.cod_unidad_medida
                        , r.referencia desc_unidad_medida
                        , nvl(r.mult, 1) mult
                        , nvl(r.div, 1) div
                        , l.cod_lista_precio
                        , l.precio_fijo precio_unitario_c_iva 
                    from vt_precios_fijos_det l
                        , st_articulos a
                        , st_relaciones r
                    where l.cod_empresa       =:p_cod_empresa
                      and l.cod_sucursal      =:p_cod_sucursal
                      
                      and l.cod_empresa       = a.cod_empresa(+)
                      and l.cod_articulo      = a.cod_articulo(+)
                      
                      and l.cod_empresa       = r.cod_empresa(+)
                      and l.cod_articulo      = r.cod_articulo(+)
                      and l.cod_unidad_medida = r.cod_unidad_rel(+)

                      and (a.cod_articulo  like '%' || :valor        || '%' or
                     upper(a.descripcion)  like '%' || upper(:valor) || '%' or :valor = 'null'
                            )
                    and rownum <= 20
                  `;
      var data = {p_cod_empresa,p_cod_sucursal,valor};
      const response = await db.Open(sql,data,true,req.headers.authuser,await crypto.decrypt(req.headers.authpass));
      res.status(200).json(response);
    } catch (e) {
      log_error.error(`getArticulo | cmfactur ${e}`)
      console.log(e);
      next();
    }
  }