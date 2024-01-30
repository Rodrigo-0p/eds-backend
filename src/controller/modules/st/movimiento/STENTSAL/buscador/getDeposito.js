const db          = require("../../../../../../connection/conn");
const crypto      = require("../../../../../../utils/crypto");
const {log_error} = require('../../../../../../utils/logger');

exports.main = async (req, res, next)  => {
  const {cod_empresa,cod_sucursal} = req.body;
  const {valor}     = req.body;
  try {
      var sql =   ` select s.cod_deposito,
                           s.descripcion desc_deposito
                      from st_depositos s
                     where s.cod_empresa  =:cod_empresa
                       and s.cod_sucursal =:cod_sucursal
                       and ( s.cod_deposito like '%'||:valor||'%' or 
                      upper( s.descripcion) like '%'||upper(:valor)||'%' or :valor = 'null')
                       and rownum <= 100
                     order by lpad(s.cod_deposito,10,'0') asc
                  `;
      var data = {cod_empresa,cod_sucursal,valor};
      
      console.log(data);

      const response = await db.Open(sql,data,true,req.headers.authuser,await crypto.decrypt(req.headers.authpass));
      res.status(200).json(response);
    } catch (e) {
      log_error.error(`getDeposito  | stentsal ${e}`)
      console.log(e);
      next();
    }
  }