const db          = require("../../../../../../connection/conn");
const crypto      = require("../../../../../../utils/crypto");
const {log_error} = require('../../../../../../utils/logger');

exports.main = async (req, res, next) => {
  
  let p_cod_empresa  = req.body.cod_empresa;
  let valor          = req.body.valor;

  if(valor !== 'null' && valor !== undefined){
    valor = '%' +  valor.replace(' ', '%') + '%';
  }
  
  try {
       var sql =` select c.cod_cliente
                       , p.nombre nom_cliente
                       , nvl(p.ruc,p.nro_documento) ruc
                       , p.telefono
                       , p.sexo
                       , p.direccion
                       , p.direc_electronica
                       , p.es_fisica
                    from cc_clientes c,
                         personas p
                   where c.cod_empresa =:p_cod_empresa 
                     and c.cod_persona = p.cod_persona
                     and rownum <= 20
                     and (c.cod_cliente like '%' || :valor || '%' or upper(p.nombre) like '%' || upper(:valor) || '%' or :valor = 'null')`;    
    var data = {p_cod_empresa,valor};
    const response = await db.Open(sql,data,true,req.headers.authuser,await crypto.decrypt(req.headers.authpass));    
    res.status(200).json(response);
  } catch (e) {
    log_error.error(`getCliente | vtpresar ${e}`)
    console.log(e);
    next();
  }
}