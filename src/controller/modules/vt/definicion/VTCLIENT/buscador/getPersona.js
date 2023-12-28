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
     var sql =`  select p.cod_persona
                      , p.nombre
                      , p.nomb_fantasia
                      , d.descripcion pais
                      , e.descripcion provincia
                      , c.descripcion ciudad
                      , p.direccion direccion_cab
                      , p.nro_documento
                      , p.nro_dig_ver
                      , p.telefono
                  from personas    p,
                        paises     d,
                        provincias e,
                        ciudades   c
                  where p.cod_pais      = d.cod_pais(+)
                  --
                  and p.cod_pais      = e.cod_pais(+)
                  and p.cod_provincia = e.cod_provincia(+)
                  --
                  and p.cod_pais      = c.cod_pais(+)
                  and p.cod_provincia = c.cod_provincia(+)
                  and p.cod_ciudad    = c.cod_ciudad(+)
                  and rownum <= 20
              and (p.cod_persona like '%' || :valor || '%' or
              upper(p.nombre)    like '%' || upper(:valor) || '%' or :valor = 'null')`;
    
    var data = {valor};
    const response = await db.Open(sql,data,true,req.headers.authuser,await crypto.decrypt(req.headers.authpass));
    res.status(200).json(response);
  } catch (e) {
    log_error.error(`getPersona | vtclient ${e}`)
    console.log(e);
    next();
  }
}