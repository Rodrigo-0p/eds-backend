const db          = require("../../../../../../../connection/conn");
const crypto      = require("../../../../../../../utils/crypto");
const {log_error} = require('../../../../../../../utils/logger');


exports.main = async (req, res, next)  => {
  const {COD_CLIENTE,COD_SUBCLIENTE} = req.body
  const COD_EMPRESA = req.body.cod_empresa;
  const {valor}     = req.body;

  try {
      var sql =   ` select s.*
                      from ( select c.cod_vendedor
                                  , v.nombre_vendedor desc_vendedor
                                  , v.cod_persona
                              from cc_cliente_vendedor c, fvv_vendedores v
                            where c.cod_empresa      = :COD_EMPRESA
                              and c.cod_cliente      = :COD_CLIENTE
                              and c.cod_subcliente   = :COD_SUBCLIENTE
                              and nvl(c.estado, 'A') = 'A'
                              and v.cod_empresa      = c.cod_empresa
                              and v.cod_vendedor     = c.cod_vendedor
                              and nvl(v.activo, 'N') = 'S'
                              and nvl(v.estado, 'N') = 'A'
                            union all
                            select v.cod_vendedor
                                , v.nombre_vendedor desc_vendedor
                                , v.cod_persona
                              from fvv_vendedores v
                            where v.cod_empresa      =:COD_EMPRESA
                              and nvl(v.activo, 'N') = 'S'
                              and v.ind_generico     = 'S'
                              and nvl(v.estado, 'N') = 'A' ) s
                        where (s.cod_vendedor like '%' || :valor || '%' or
                          upper(s.desc_vendedor)   like '%' || upper(:valor) || '%' or :valor = 'null')
                          and rownum <= 20
                        order by 1
                  `;
      var data = {COD_EMPRESA,COD_CLIENTE,COD_SUBCLIENTE,valor};
      const response = await db.Open(sql,data,true,req.headers.authuser,await crypto.decrypt(req.headers.authpass));
      res.status(200).json(response);
    } catch (e) {
      log_error.error(`getVendedor | CCNCRDEF ${e}`)
      console.log(e);
      next();
    }
  }