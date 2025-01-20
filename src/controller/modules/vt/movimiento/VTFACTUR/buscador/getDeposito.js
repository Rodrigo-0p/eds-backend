const db          = require("../../../../../../connection/conn");
const crypto      = require("../../../../../../utils/crypto");
const {log_error} = require('../../../../../../utils/logger');

exports.main = async (req, res, next)  => {
  const { cod_empresa, cod_sucursal, valor} = req.body;
  try {
      var sql =   ` select d.cod_deposito,
                           d.descripcion desc_deposito
                      from st_depositos d
                     where d.cod_empresa = :cod_empresa
                       and d.cod_sucursal = :cod_sucursal
                       and ( d.cod_deposito like '%'||:valor||'%' or upper( d.descripcion) like '%'||upper(:valor)||'%' or :valor = 'null')
                       and nvl(activo,'N') = 'S' 
                     order by lpad(d.cod_deposito,10,'0') asc
                  `;
      var data = {cod_empresa, cod_sucursal, valor}; 
      const response = await db.Open(sql,data,true,req.headers.authuser,await crypto.decrypt(req.headers.authpass));
      res.status(200).json(response);
    } catch (e) {
      log_error.error(`getDeposito | vtfactur ${e}`)
      console.log(e);
      next();
    }
  }