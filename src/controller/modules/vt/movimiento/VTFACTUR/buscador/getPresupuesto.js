const db          = require("../../../../../../connection/conn");
const oracledb    = require("oracledb");
const crypto      = require("../../../../../../utils/crypto");
const {log_error} = require('../../../../../../utils/logger'); 
exports.main = async (req, res, next) => { 
  let cod_empresa  = req.body.cod_empresa;
  let cod_cliente  = req.body.cod_cliente;
  let cod_subcliente = req.body.cod_subcliente;
  let valor        = req.body.valor ? req.body.valor : 'null'; 
  try {
     let sql =`  select v.cod_empresa,
                        v.tip_comprobante tip_comprobante_ref,
                        v.ser_comprobante ser_comprobante_ref, 
                        v.nro_comprobante nro_comprobante_ref, 
                        v.cod_cliente,
                        p.nombre nom_cliente,
                        v.tot_comprobante
                   from vt_presupuesto_cab v, cc_clientes c, personas p 
                  where v.cod_empresa = c.cod_empresa
                    and v.cod_cliente = c.cod_cliente 
                    and c.cod_persona = p.cod_persona
                    and v.cod_empresa = :cod_empresa
                    and v.cod_cliente = :cod_cliente
                    -- and v.cod_subcliente = :cod_subcliente
                    and v.estado = 'P'
                    
                    and (
                          v.nro_comprobante like '%' || :valor || '%' or
                          v.cod_cliente     like '%' || :valor || '%' or
                          v.cod_cliente     like '%' || :valor || '%' or
                          upper(p.nombre)   like '%' || upper(:valor) || '%' or :valor = 'null' )
                    and rownum <= 100
                  order by v.fec_comprobante asc  `;
    
    let data = { cod_empresa, cod_cliente, /*cod_subcliente,*/ valor }; 
    const response = await db.Open(sql,data,true,req.headers.authuser,await crypto.decrypt(req.headers.authpass));

    console.log( response );

    res.status(200).json(response);
  } catch (e) {
    log_error.error(`getPresupuesto | vtfactur ${e}`)
    console.log(e);
    next();
  }
}