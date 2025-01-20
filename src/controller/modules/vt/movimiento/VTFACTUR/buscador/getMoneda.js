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
     var sql =`  select cod_moneda, descripcion desc_moneda 
     							 from monedas m
                  where (m.cod_moneda like '%' || :valor || '%' or upper(m.descripcion) like '%' || upper(:valor) || '%' or :valor = 'null')
                    and rownum <= 100
                  order by lpad(m.cod_moneda, 10, '0') asc`;
    var data = { valor };

    console.log(data );

    const response = await db.Open(sql,data,true,req.headers.authuser,await crypto.decrypt(req.headers.authpass));
    res.status(200).json(response);
  } catch (e) {
    log_error.error(`getMoneda | vtfactur ${e}`);
    console.log(e);
    next();
  }
}