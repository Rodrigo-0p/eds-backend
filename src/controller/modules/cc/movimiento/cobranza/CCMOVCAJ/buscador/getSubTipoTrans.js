const db             = require("../../../../../../../connection/conn");
const crypto         = require("../../../../../../../utils/crypto");
const {logger_error} = require('../../../../../../../utils/logger');

exports.main = async (req, res, next) => {
  
  const {COD_EMPRESA = "", COD_MODULO = '', TIPO_TRANS = ''} = req.body
  let valor  = req.body.valor ? req.body.valor : null;
  
  if(valor != 'null' && valor != undefined){
    valor = '%' +  valor.replace(' ', '%') + '%';
  }

  try {
       var sql = `  select c.subtipo_trans sub_tipo_trans
                         , c.descripcion desc_transaccion
                         , c.tip_documento
                      from subtipos_trans c                          
                     where c.cod_empresa =:COD_EMPRESA
                       and c.cod_modulo  =:COD_MODULO 
                       and c.tipo_trans  =:TIPO_TRANS 
                       and (c.subtipo_trans like '%' || :valor        || '%' or
                      upper(c.descripcion)  like '%' || upper(:valor) || '%' or :valor = 'null')
                       and rownum <= 20
                     order by 2`;
    var data = {COD_EMPRESA,COD_MODULO,TIPO_TRANS,valor};
    const response = await db.Open(sql,data,true,req.headers.authuser,await crypto.decrypt(req.headers.authpass));
    res.status(200).json(response);
  } catch (error) {
    logger_error.error(`getSubTipoTrans | CCMOVCAJ ${error}`)
    console.log(error);
    next();
  }
}