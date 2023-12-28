const db          = require("../../../../../../connection/conn");
const oracledb    = require("oracledb");
const crypto      = require("../../../../../../utils/crypto");
const {log_error} = require('../../../../../../utils/logger');

exports.main = async (req, res, next) => {
  
  var cod_empresa  = req.body.cod_empresa;
  var valor        = req.body.valor;

  if(valor !== 'null' && valor !== undefined){
    valor = '%' +  valor.replace(' ', '%') + '%';
  }
  
  try {
     var sql =`  select c.cod_grupo_cliente
                      , c.descripcion desc_grupo_cliente
                    from cc_grupo_cliente c
                  where c.cod_empresa = :cod_empresa
                    and rownum <= 20
                    and (c.cod_grupo_cliente like '%' || :valor        || '%' or
                   upper(c.descripcion)      like '%' || upper(:valor) || '%' or :valor = 'null')`;
    
    var data = {cod_empresa,valor};
    const response = await db.Open(sql,data,true,req.headers.authuser,await crypto.decrypt(req.headers.authpass));    
    res.status(200).json(response);
  } catch (e) {
    log_error.error(`getGrupoCliente | vtclient ${e}`)
    console.log(e);
    next();
  }
}