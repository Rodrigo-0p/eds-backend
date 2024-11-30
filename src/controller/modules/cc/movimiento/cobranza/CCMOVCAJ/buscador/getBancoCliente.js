const db             = require("../../../../../../../connection/conn");
const crypto         = require("../../../../../../../utils/crypto");
const {logger_error} = require('../../../../../../../utils/logger');

exports.main = async (req, res, next) => {
  
  const {CARGA_VALORES = "", SECTOR_BANCARIO = ''} = req.body
  let valor  = req.body.valor;
  
  if(valor != 'null' && valor != undefined){
    valor = '%' +  valor.replace(' ', '%') + '%';
  }

  try {
      var sql = `  select c.cod_banco_cliente
                        , c.desc_banco nombre
                        , c.cod_banco
                        , c.referencia
                     from chv_banco_referencia c                
                    where c.cod_sector =:SECTOR_BANCARIO
                      and nvl('${CARGA_VALORES}','N') = 'S'
                      and (c.cod_banco_cliente like '%' || :valor        || '%' or
                     upper(c.desc_banco)       like '%' || upper(:valor) || '%' or :valor = 'null')
                      and rownum <= 20
                    order by 2`;
    var data = {SECTOR_BANCARIO,valor};
    const response = await db.Open(sql,data,true,req.headers.authuser,await crypto.decrypt(req.headers.authpass));
    res.status(200).json(response);
  } catch (error) {
    logger_error.error(`getBancoCliente | CCMOVCAJ ${error}`)
    console.log(error);
    next();
  }
}