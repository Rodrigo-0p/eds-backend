const db          = require("../../../../../../connection/conn");
const crypto      = require("../../../../../../utils/crypto");
const {log_error} = require('../../../../../../utils/logger');

exports.main = async (req, res, next)  => {
  const {valor}       = req.body;
  let cod_empresa     = req.body.cod_empresa
  
  try {
      var sql =   `select c.cod_lista_precio
                        , c.descripcion desc_lista_precio
                        , m.cod_moneda
                        , m.descripcion desc_moneda
                        , m.decimales
                        , m.tipo_cambio_dia tip_cambio                  
                    from vt_precios_fijos_cab c , 
                          monedas             m
                    where c.cod_moneda  = m.cod_moneda
                      and c.cod_empresa =:cod_empresa
                      and (c.cod_lista_precio like '%' || :valor        || '%' or
                     upper(c.descripcion)     like '%' || upper(:valor) || '%' or :valor = 'null')
                    order by c.cod_moneda`;
      var data = {valor,cod_empresa};
      const response = await db.Open(sql,data,true,req.headers.authuser,await crypto.decrypt(req.headers.authpass));
      res.status(200).json(response);
    } catch (e) {
      log_error.error(`getListaPrecio | vt_precios_fijos_cab ${e}`)
      console.log(e);
      next();
    }
  }