const db          = require("../../../../../../../../connection/conn");
const crypto      = require("../../../../../../../../utils/crypto");
const {log_error} = require('../../../../../../../../utils/logger');


exports.main = async (req, res, next)  => {
  const {COD_CLIENTE = '', COD_SUBCLIENTE = ''} = req.body
  const COD_EMPRESA = req.body.cod_empresa;
  const {valor}     = req.body;

  try {
      var sql =   `  select c.nro_comprobante nro_comprobante_ref,
                            c.tip_comprobante tip_comprobante_ref,
                            c.ser_comprobante ser_comprobante_ref,
                            to_char(c.fec_comprobante, 'dd/mm/yyyy') fec_comprobant,
                            c.cod_vendedor,
                            c.desc_vend,
                            c.tot_comprobante,
                            c.nro_ncr_cliente
                      from ccv_nota_creditos_pendiente c
                      where c.cod_empresa = :COD_EMPRESA
                        and c.cod_cliente = :COD_CLIENTE
                        and c.cod_subcliente = :COD_SUBCLIENTE
                        and ( c.nro_comprobante like '%' || :valor || '%' or :valor = 'null')
                        and rownum <= 20
                      order by 1 desc
                  `;
      var data = { COD_EMPRESA
                 , COD_CLIENTE
                 , COD_SUBCLIENTE
                 , valor};
      const response = await db.Open(sql,data,true,req.headers.authuser,await crypto.decrypt(req.headers.authpass));
      res.status(200).json(response);
    } catch (e) {
      log_error.error(`getNroCompRef | CCNCRDEF ${e}`)
      console.log(e);
      next();
    }
  }