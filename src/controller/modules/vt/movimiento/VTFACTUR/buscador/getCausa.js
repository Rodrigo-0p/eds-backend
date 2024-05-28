const db          = require("../../../../../../connection/conn");
const crypto      = require("../../../../../../utils/crypto");
const {log_error} = require('../../../../../../utils/logger');

exports.main = async (req, res, next)  => {
  const cod_empresa = req.body.cod_empresa;
  const {valor}     = req.body;
  try {
      var sql =   ` select s.cod_causa,
                           s.descripcion desc_causa
                      from st_causa_trans s
                     where s.cod_empresa = :cod_empresa
                       and ( s.cod_causa like '%'||:valor||'%' or 
                      upper( s.descripcion) like '%'||upper(:valor)||'%' or :valor = 'null')                      
                       and rownum <= 100
                     order by lpad(s.cod_causa,10,'0') asc
                  `;
      var data = {cod_empresa,valor};
      const response = await db.Open(sql,data,true,req.headers.authuser,await crypto.decrypt(req.headers.authpass));
      res.status(200).json(response);
    } catch (e) {
      log_error.error(`getcausa | stentsal ${e}`)
      console.log(e);
      next();
    }
  }