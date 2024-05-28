const db          = require("../../../../../../../connection/conn");
const crypto      = require("../../../../../../../utils/crypto");
const {log_error} = require('../../../../../../../utils/logger');

exports.main = async (req, res, next)  => {
  const {cod_empresa,cod_usuario = ''} = req.body;
  const {valor}                         = req.body;
  try {
      var sql =   `select c.nro_cuenta
                        , c.referencia desc_cuenta
                        , c.nom_banco 
                        , c.cod_banco
                        , c.cod_moneda
                        , c.desc_moneda
                        , c.tip_cambio
                    from ccv_usuarios_cuentas c
                    where cod_empresa =:cod_empresa 
                      and cod_usuario =:cod_usuario
                        and nvl(c.ind_caja_interna,'N') = 'S'
                        and nvl(c.afecta_rechazo ,'N')  = 'S'
                      and (c.nro_cuenta like      '%' || :valor        || '%' or
                          upper(c.nom_banco) like '%' || upper(:valor) || '%' or :valor = 'null')
                      and rownum <= 20
                    order by lpad(c.nro_cuenta, 10, '0') asc`;
      var data = {cod_empresa,cod_usuario,valor};
      const response = await db.Open(sql,data,true,req.headers.authuser,await crypto.decrypt(req.headers.authpass));
      res.status(200).json(response);
    } catch (e) {
      log_error.error(`getNroCuenta | CCRENAGR ${e}`)
      console.log(e);
      next();
    }
  }