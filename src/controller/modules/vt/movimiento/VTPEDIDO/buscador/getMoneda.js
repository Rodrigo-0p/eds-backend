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
     var sql =`  select cod_moneda, descripcion desc_moneda 
     							 from monedas m
                  where m.cod_empresa = :cod_moneda
                    and (m.cod_moneda like '%' || :valor || '%' or upper(m.descripcion) like '%' || upper(:valor) || '%' or :valor = 'null')
                    and rownum <= 100
                  order by lpad(a.cod_moneda, 10, '0') asc`;
    var data = {cod_empresa,valor};
    const response = await db.Open(sql,data,true,req.headers.authuser,await crypto.decrypt(req.headers.authpass));
    res.status(200).json(response);
  } catch (e) {
    log_error.error(`getMoneda | vtfactur ${e}`);
    console.log(e);
    next();
  }
}