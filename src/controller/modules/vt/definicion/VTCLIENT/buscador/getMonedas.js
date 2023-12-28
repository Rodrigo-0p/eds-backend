const db          = require("../../../../../../connection/conn");
const oracledb    = require("oracledb");
const crypto      = require("../../../../../../utils/crypto");
const {log_error} = require('../../../../../../utils/logger');

exports.main = async (req, res, next) => {
  
  var valor        = req.body.valor;

  if(valor !== 'null' && valor !== undefined){
    valor = '%' +  valor.replace(' ', '%') + '%';
  }

  try {
     var sql =` select c.cod_moneda  cod_moneda_limite
                     , c.descripcion desc_moneda_limite
                  from monedas c
                 where rownum <= 20
                   and (c.cod_moneda   like '%' || :valor        || '%' or
                  upper(c.descripcion) like '%' || upper(:valor) || '%' or :valor = 'null')`;
    
    var data = {valor};
    const response = await db.Open(sql,data,true,req.headers.authuser,await crypto.decrypt(req.headers.authpass));    
    res.status(200).json(response);
  } catch (e) {
    log_error.error(`getMoneda | vtclient ${e}`)
    console.log(e);
    next();
  }
}