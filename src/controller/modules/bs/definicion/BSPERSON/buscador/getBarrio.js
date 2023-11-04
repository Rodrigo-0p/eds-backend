const db          = require("../../../../../../connection/conn");
const oracledb    = require("oracledb");
const crypto      = require("../../../../../../utils/crypto");
const {log_error} = require('../../../../../../utils/logger');

exports.main = async (req, res, next) => {
  
  var cod_pais      = req.body.cod_pais
  var cod_provincia = req.body.cod_provincia;
  var cod_ciudad    = req.body.cod_ciudad;
  var valor         = req.body.valor;
  
  if(valor !== 'null' && valor !== undefined){
    valor = '%' +  valor.replace(' ', '%') + '%';
  }
  
  try {
     var sql = `  select p.cod_barrio
                       , p.descripcion desc_barrio
                    from barrios p
                   where p.cod_pais      =:cod_pais
                     and p.cod_provincia =:cod_provincia
                     and p.cod_ciudad    =:cod_ciudad
                     and rownum <= 20
                     and (p.cod_barrio   like '%' || :valor || '%' or
                   upper(p.descripcion)  like '%' || upper(:valor) || '%' or :valor = 'null')`;
    
    var data = {cod_pais,cod_provincia,cod_ciudad,valor};
    const response = await db.Open(sql,data,true,req.headers.authuser,await crypto.decrypt(req.headers.authpass));
    res.status(200).json(response);
  } catch (e) {
    log_error.error(`getBarrio | bsPersona ${e}`)
    console.log(e);
    next();
  }
}