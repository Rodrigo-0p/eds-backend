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
     var sql =`  select a.cod_articulo,
                        a.descripcion desc_articulo,
                        '01' cod_unidad_medida,
                        inv_otros.lote_defecto nro_lote,
                        to_char(inv_otros.fecha_lote_defecto,'dd/mm/yyyy') fec_vencimiento,
                        a.rowid id
                   from st_articulos a
                  where a.cod_empresa =:cod_empresa 
                    and (a.cod_articulo like '%' || :valor || '%' or
                        upper(a.descripcion) like '%' || upper(:valor) || '%' or :valor = 'null')
                    and rownum <= 100
                  order by lpad(a.cod_articulo, 10, '0') asc`;
    
    var data = {cod_empresa,valor};
    const response = await db.Open(sql,data,true,req.headers.authuser,await crypto.decrypt(req.headers.authpass));
    res.status(200).json(response);
  } catch (e) {
    log_error.error(`getArticulo | stentsal ${e}`)
    console.log(e);
    next();
  }
}