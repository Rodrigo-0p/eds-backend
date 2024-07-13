const db          = require("../../../../../../../../connection/conn");
const crypto      = require("../../../../../../../../utils/crypto");
const {log_error} = require('../../../../../../../../utils/logger');
const _           = require('underscore');

exports.main = async (req, res, next)  => {
  let p_cod_empresa  = req.body.cod_empresa;
  const {valor}      = req.body;

  try {
      var sql =   `select a.cod_articulo
                        , a.descripcion desc_articulo                        
                    from  st_articulos a
                    where a.cod_empresa =:p_cod_empresa
                      and nvl( a.estado,'A') <> 'I'
                      and (a.cod_articulo  like '%' || :valor        || '%' or
                     upper(a.descripcion)  like '%' || upper(:valor) || '%' or :valor = 'null')
                    and rownum <= 20
                  `;
      var data = {p_cod_empresa,valor};
      const response = await db.Open(sql,data,true,req.headers.authuser,await crypto.decrypt(req.headers.authpass));
      res.status(200).json(response);
    } catch (e) {
      log_error.error(`getArticulo | CCNCRDEF ${e}`)
      console.log(e);
      next();
    }
  }