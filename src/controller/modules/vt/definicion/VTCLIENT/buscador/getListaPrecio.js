const db          = require("../../../../../../connection/conn");
const oracledb    = require("oracledb");
const crypto      = require("../../../../../../utils/crypto");
const {log_error} = require('../../../../../../utils/logger');

exports.main = async (req, res, next) => {
  
  var cod_empresa  = req.body.cod_empresa
  var valor        = req.body.valor;

  if(valor !== 'null' && valor !== undefined){
    valor = '%' +  valor.replace(' ', '%') + '%';
  }

  try {
     var sql =`  select c.cod_lista_precio
                      , c.descripcion desc_lista_precio
                   from vt_precios_fijos_cab c
                  where c.cod_empresa =:cod_empresa
                    and rownum <= 20
                    and (c.cod_lista_precio like '%' || :valor        || '%' or
                   upper(c.descripcion)     like '%' || upper(:valor) || '%' or :valor = 'null')`;
    
    var data = {valor,cod_empresa};
    const response = await db.Open(sql,data,true,req.headers.authuser,await crypto.decrypt(req.headers.authpass));    
    res.status(200).json(response);
  } catch (e) {
    log_error.error(`getListaPrecio | vtclient ${e}`)
    console.log(e);
    next();
  }
}