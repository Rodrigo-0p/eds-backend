const db          = require("../../../../../../../../connection/conn");
const crypto      = require("../../../../../../../../utils/crypto");
const {log_error} = require('../../../../../../../../utils/logger');


exports.main = async (req, res, next)  => {
  
  const {COD_CLIENTE = '', COD_SUBCLIENTE = ''}	 = req.body;
  const COD_EMPRESA = req.body.cod_empresa
  const {valor}     = req.body;

  try {
      var sql =   `  select z.cod_zona
                          , z.descripcion desc_zona
                      from zonas_geograficas z
                          , zonas_clientes c
                      where z.cod_empresa     =:COD_EMPRESA
                        and (c.cod_cliente    =:COD_CLIENTE)
                        and (c.cod_subcliente =:COD_SUBCLIENTE or :COD_SUBCLIENTE  is null)
                        and c.cod_empresa     = z.cod_empresa
                        and c.cod_zona        = z.cod_zona
                        and (z.cod_zona     like '%' || :valor || '%' or 
                       upper(z.descripcion) like '%' || upper(:valor) || '%' or :valor = 'null')
                        and rownum <= 20
                      order by lpad(z.cod_zona, 10, '0') asc
                  `;
      var data = {COD_EMPRESA,COD_CLIENTE,COD_SUBCLIENTE,valor};
      const response = await db.Open(sql,data,true,req.headers.authuser,await crypto.decrypt(req.headers.authpass));
      res.status(200).json(response);
    } catch (e) {
      log_error.error(`getMonda | CCNCRDEF ${e}`)
      console.log(e);
      next();
    }
  }