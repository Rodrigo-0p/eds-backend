const db          = require("../../../../../../connection/conn");
const oracledb    = require("oracledb");
const crypto      = require("../../../../../../utils/crypto");
const {log_error} = require('../../../../../../utils/logger');

exports.main = async (req, res, next)  => {
  var valor = req.body.valor;
  try {
      var sql =   ` select *
                      from (select p.cod_persona cod_persona ,
                                   p.nombre      desc_persona
                              from personas p
                             where (p.cod_persona like '%' || :valor || '%' or upper(p.nombre) like '%' || upper(:valor) || '%' or :valor = 'null')
                          order by lpad(p.cod_persona, 10, '0') desc)
                  where rownum <= 30
                  `;
      var data = {valor};
      const response = await db.Open(sql,data,true,req.headers.authuser,await crypto.decrypt(req.headers.authpass));
      res.status(200).json(response);
    } catch (e) {
      log_error.error(`getPersona | cmprovec ${e}`)
      console.log(e);
      next();
    }
  }