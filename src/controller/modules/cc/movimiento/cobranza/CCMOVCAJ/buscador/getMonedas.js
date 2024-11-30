const db          = require("../../../../../../../connection/conn");
const oracledb    = require("oracledb");
const crypto      = require("../../../../../../../utils/crypto");
const {log_error} = require('../../../../../../../utils/logger');

exports.main = async (req, res, next)  => {
  const {COD_EMPRESA = '', COD_USUARIO = '',  COD_MONEDA = ''} = req.body
  var valor          = req.body.valor;
  try {
        var sql = `  select c.cod_moneda cod_moneda_cobro
                          , c.desc_moneda
                          , c.siglas
                          , c.nro_cuenta
                          , c.referencia 
                          , c.ind_inpasa
                      from ccv_cuentas_bancarias c
                         , cc_cajas_cobro u
                      here nvl(c.ind_caja_chica,'N') = 'S'
                       and c.cod_empresa =:COD_EMPRESA
                       and c.cod_moneda  =:COD_MONEDA
                       and c.cod_empresa = u.cod_empresa
                       and c.nro_cuenta  = u.nro_cuenta 
                       and u.estado      = 'A'
                       and u.cod_usuario =:COD_USUARIO
                       and (c.cod_moneda   like '%' ||       :valor  || '%' or 
                      upper(c.desc_moneda) like '%' || upper(:valor) || '%' or :valor = 'null')
                       and rownum <= 20
                     order by lpad(c.cod_moneda, 10, '0') asc`;
      var data = {COD_EMPRESA, COD_USUARIO, COD_MONEDA, valor};
      const response = await db.Open(sql,data,true,req.headers.authuser,await crypto.decrypt(req.headers.authpass));
      res.status(200).json(response);
    } catch (e) {
      log_error.error(`getMoneda | ccmovcaj ${e}`)
      console.log(e);
      next();
    }
  }