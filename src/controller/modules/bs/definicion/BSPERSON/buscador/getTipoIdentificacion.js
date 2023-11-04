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
     var sql = `  select p.cod_ident
                       , p.descripcion desc_ident
                    from identificaciones  p
                   where rownum <= 20
                    and (p.cod_ident like '%' || :valor || '%' or
                   upper(p.descripcion)  like '%' || upper(:valor) || '%' or :valor = 'null')`;
    
    var data = {valor};
    const response = await db.Open(sql,data,true,req.headers.authuser,await crypto.decrypt(req.headers.authpass));
    res.status(200).json(response);
  } catch (e) {
    log_error.error(`getIdentificación | bsPersona ${e}`)
    console.log(e);
    next();
  }
}