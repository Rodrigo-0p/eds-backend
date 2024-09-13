const db          = require("../../../../../../../connection/conn");
const crypto      = require("../../../../../../../utils/crypto");
const {log_error} = require('../../../../../../../utils/logger');
const _           = require('underscore');

exports.main = async (req, res, next)=>{
  var cod_empresa    = req.body.cod_empresa;
  let dependencia    =  _.extend( ...req.body.dependencia );
  let cod_articulo   = dependencia.COD_ARTICULO  ? dependencia.COD_ARTICULO : '';
  var valor          = req.body.valor;

  if(valor != 'null' && valor != undefined){
    valor = '%' +  valor.replace(' ', '%') + '%';
  }

  try {
    var sql = `select c.cod_unidad_rel cod_unidad_medida
                    , c.referencia desc_unidad_medida
                    , nvl(c.mult, 1) mult
                    , nvl(c.div, 1) div
                from st_relaciones c
                where c.cod_empresa  = :cod_empresa
                  and c.cod_articulo = :cod_articulo
                  and rownum <= 20
                  and (c.cod_unidad_rel like '%' || :valor || '%' or
                      upper(c.referencia) like '%' || upper(:valor) || '%' or :valor = 'null')
                order by lpad(c.cod_unidad_rel, 10, '0') asc    
                `;
    var data = {cod_empresa,cod_articulo,valor};
    const response = await db.Open(sql,data,true,req.headers.authuser,await crypto.decrypt(req.headers.authpass));
    res.status(200).json(response);
  } catch (error) {
    log_error.error(`getUnidadMedida | CCNCRDEF  ${error}`)
    console.log(error);
    next();
  }
}