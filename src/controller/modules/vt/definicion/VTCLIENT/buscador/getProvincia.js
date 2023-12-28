const db          = require("../../../../../../connection/conn");
const oracledb    = require("oracledb");
const crypto      = require("../../../../../../utils/crypto");
const {log_error} = require('../../../../../../utils/logger');

exports.main = async (req, res, next) => {
  
  var cod_pais  = req.body?.dependencia[0].COD_PAIS
  var valor     = req.body.valor;
  
  if(valor !== 'null' && valor !== undefined){
    valor = '%' +  valor.replace(' ', '%') + '%';
  }
  
  try {
     var sql = `  select p.cod_provincia
                       , p.descripcion desc_provincia
                    from provincias  p
                   where p.cod_pais =:cod_pais
                    and rownum <= 20
                    and (p.cod_provincia like '%' || :valor || '%' or
                   upper(p.descripcion)  like '%' || upper(:valor) || '%' or :valor = 'null')`;
    
    var data = {cod_pais,valor};
    const response = await db.Open(sql,data,true,req.headers.authuser,await crypto.decrypt(req.headers.authpass));
    res.status(200).json(response);
  } catch (e) {
    log_error.error(`getDepartamento | vtclient ${e}`)
    console.log(e);
    next();
  }
}