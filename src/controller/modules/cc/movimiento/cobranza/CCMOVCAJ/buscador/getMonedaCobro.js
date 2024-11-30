const db          = require("../../../../../../../connection/conn");
const crypto      = require("../../../../../../../utils/crypto");
const {logger_error} = require('../../../../../../../utils/logger');

exports.main = async (req, res, next) => {
  
  const {COD_EMPRESA = "", COD_USUARIO = '', COD_MONEDA_CAB = ''} = req.body
  let valor  = req.body.valor;
  
  if(valor != 'null' && valor != undefined){
    valor = '%' +  valor.replace(' ', '%') + '%';
  }

  try {
      var sql = `  select c.cod_moneda
                        , c.desc_moneda
                        , c.siglas
                        , c.nro_cuenta
                        , c.referencia 
                        , c.ind_inpasa                         
                     from ccv_cuentas_bancarias c
                        , cc_cajas_cobro u
                    where nvl(c.ind_caja_chica,'N') = 'S'
                      and c.cod_empresa = :COD_EMPRESA
                      and u.cod_usuario = :COD_USUARIO
                      and u.estado      = 'A'
                      and c.cod_moneda  = :COD_MONEDA_CAB
                      --
                      and c.cod_empresa = u.cod_empresa
                      and c.nro_cuenta  = u.nro_cuenta       
                      --
                      and (c.cod_moneda   like '%' || :valor        || '%' or
                     upper(c.desc_moneda) like '%' || upper(:valor) || '%' or :valor = 'null')
                      and rownum <= 20
                    order by 2`;
    var data = {COD_EMPRESA,COD_USUARIO,COD_MONEDA_CAB, valor};
    const response = await db.Open(sql,data,true,req.headers.authuser,await crypto.decrypt(req.headers.authpass));
    res.status(200).json(response);
  } catch (error) {
    logger_error.error(`getSubTipoTrans | CCMOVCAJ ${error}`)
    console.log(error);
    next();
  }
}