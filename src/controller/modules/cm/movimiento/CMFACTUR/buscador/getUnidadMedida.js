const db          = require("../../../../../../connection/conn");
const crypto      = require("../../../../../../utils/crypto");
const {log_error} = require('../../../../../../utils/logger');

exports.main = async (req, res, next)=>{
  var cod_empresa   = req.body.cod_empresa;
  var cod_articulo  = req.body.dependencia[3].COD_ARTICULO
  var valor         = req.body.valor;
  
  if(valor != 'null' && valor != undefined){
    valor = '%' +  valor.replace(' ', '%') + '%';
  }

  try {
    var sql =  `select *
                  from ( select c.cod_unidad_rel cod_unidad_medida,
                                c.referencia desc_unidad_medida,
                                c.cod_unidad_rel || '-' || referencia id
                           from st_relaciones c
                          where c.cod_empresa  = :cod_empresa
                            and c.cod_articulo = :cod_articulo
                            and (c.cod_unidad_rel   like '%' || :valor        || '%' or
                                upper(c.referencia) like '%' || upper(:valor) || '%' or :valor = 'null')
                          order by lpad(c.cod_unidad_rel, 10, '0') asc
                        )
                where rownum <= 20
                `;
    var data = {cod_empresa,cod_articulo,valor};
    const response = await db.Open(sql,data,true,req.headers.authuser,await crypto.decrypt(req.headers.authpass));
    res.status(200).json(response);
  } catch (error) {
    log_error.error(`getArticulos | CMFACTUR  ${error}`)
    console.log(error);
    next();
  }
}