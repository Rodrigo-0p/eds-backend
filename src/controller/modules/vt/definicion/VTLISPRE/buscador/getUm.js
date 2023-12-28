const db          = require("../../../../../../connection/conn");
const oracledb    = require("oracledb");
const crypto      = require("../../../../../../utils/crypto");
const {log_error} = require('../../../../../../utils/logger');

exports.main = async (req, res, next) => {
  
  var cod_empresa  = req.body.cod_empresa;
  var cod_articulo = req.body.dependencia[0].COD_ARTICULO
  var valor        = req.body.valor;

  if(valor !== 'null' && valor !== undefined){
    valor = '%' +  valor.replace(' ', '%') + '%';
  }
  
  try {
     var sql =`  select r.cod_unidad_rel cod_unidad_medida
                      , r.referencia desc_unidad_medida
                      , r.rowid id
                   from st_relaciones r,
                        st_articulos  a
                  where r.cod_empresa  = :cod_empresa
                    and r.cod_articulo = :cod_articulo
                    and r.cod_empresa  = a.cod_empresa
                    and r.cod_articulo = a.cod_articulo
                    and (r.cod_unidad_rel like '%' || :valor || '%' or
                        upper(r.referencia) like '%' || upper(:valor) || '%' or :valor = 'null')
                    and rownum <= 100
                  order by lpad(r.cod_unidad_rel, 10, '0') asc`;
    var data = {cod_empresa,cod_articulo,valor};
    const response = await db.Open(sql,data,true,req.headers.authuser,await crypto.decrypt(req.headers.authpass));    
    res.status(200).json(response);
  } catch (e) {
    log_error.error(`getUm | vtlispre ${e}`)
    console.log(e);
    next();
  }
}