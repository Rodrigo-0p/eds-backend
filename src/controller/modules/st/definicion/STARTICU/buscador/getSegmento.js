const db          = require("../../../../../../connection/conn");
const crypto      = require("../../../../../../utils/crypto");
const {log_error} = require('../../../../../../utils/logger');

exports.main = async (req, res, next)  => {
  const cod_empresa       = req.body.cod_empresa;
  const {valor,cod_linea} = req.body;
  
  try {
      var sql =   ` select *
                      from (
                    select p.cod_categoria, p.descripcion desc_categoria
                      from st_categoria p
                    where p.cod_empresa = :cod_empresa
                      and p.cod_linea   = :cod_linea
                      and (p.cod_categoria like '%' || :valor || '%' or upper(p.descripcion) like '%' || upper(:valor) || '%' or :valor = 'null')
                      and nvl(p.estado, 'I') = 'A'
                    order by lpad(p.cod_categoria, 10, '0') asc
                          )
                    where rownum <= 100
                  `;
    var data = {cod_empresa,cod_linea,valor};
    const response = await db.Open(sql,data,true,req.headers.authuser,await crypto.decrypt(req.headers.authpass));
    res.status(200).json(response);
  } catch (e) {
    log_error.error(`getRubro | starticu ${e}`)
    console.log(e);
    next();
  }
}