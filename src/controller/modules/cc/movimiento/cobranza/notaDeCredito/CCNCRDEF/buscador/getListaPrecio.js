const db          = require("../../../../../../../../connection/conn");
const crypto      = require("../../../../../../../../utils/crypto");
const {log_error} = require('../../../../../../../../utils/logger');


exports.main = async (req, res, next)  => {
  const cod_empresa = req.body.cod_empresa;
  const {valor}     = req.body;

  try {
      var sql =   ` select s.cod_lista_precio
                         , s.descripcion desc_lista_precio
                      from vt_precios_fijos_cab s
                     where s.cod_empresa =:cod_empresa
                       and (s.cod_lista_precio like '%' || :valor || '%' or
                      upper(s.descripcion)     like '%' || upper(:valor) || '%' or :valor = 'null')
                       and rownum <= 20
                     order by 1
                  `;
      var data = {cod_empresa,valor};
      const response = await db.Open(sql,data,true,req.headers.authuser,await crypto.decrypt(req.headers.authpass));
      res.status(200).json(response);
    } catch (e) {
      log_error.error(`getListaPrecio | CCNCRDEF ${e}`)
      console.log(e);
      next();
    }
  }