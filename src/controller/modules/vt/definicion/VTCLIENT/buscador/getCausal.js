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
     var sql =`  select c.cod_causal
                      , c.descripcion desc_causal
                    from cc_causales c
                  where rownum <= 20
                    and (c.cod_causal   like '%' || :valor || '%' or 
                   upper(c.descripcion) like '%' || upper(:valor) || '%' or :valor = 'null')`;
    
    var data = {valor};
    const response = await db.Open(sql,data,true,req.headers.authuser,await crypto.decrypt(req.headers.authpass));    
    res.status(200).json(response);
  } catch (e) {
    log_error.error(`getCausal | vtclient ${e}`)
    console.log(e);
    next();
  }
}