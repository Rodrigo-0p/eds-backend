const db          = require("../../../../../../connection/conn");
const crypto      = require("../../../../../../utils/crypto");
const {log_error} = require('../../../../../../utils/logger');

exports.main = async (req, res, next)  => {
  const {cod_empresa} = req.body;
  const {valor}     = req.body;
  try {
      var sql =   ` select s.cod_motivo
                        ,  s.descripcion desc_motivo
                        ,  s.ind_ent_sal
                        ,  s.afecta_costo
                      from st_motivo_ent_sal  s
                     where s.cod_empresa  =:cod_empresa
                       
                       and nvl(s.activo, 'N')      = 'S'
                       and nvl(s.ind_ent_sal, 'X') = 'A'
                       and nvl(s.tipo, 'X')        = 'T'                 

                       and ( s.cod_motivo   like '%'||:valor||'%' or 
                      upper( s.descripcion) like '%'||upper(:valor)||'%' or :valor = 'null')                      
                       and rownum <= 100
                     order by lpad(s.cod_motivo,10,'0') asc
                  `;
      var data = {cod_empresa,valor};
      const response = await db.Open(sql,data,true,req.headers.authuser,await crypto.decrypt(req.headers.authpass));
      res.status(200).json(response);
    } catch (e) {
      log_error.error(`getMotivo | stenvio ${e}`)
      console.log(e);
      next();
    }
  }