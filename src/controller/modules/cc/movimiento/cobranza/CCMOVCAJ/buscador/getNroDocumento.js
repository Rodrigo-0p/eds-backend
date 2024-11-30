const db             = require("../../../../../../../connection/conn");
const crypto         = require("../../../../../../../utils/crypto");
const {logger_error} = require('../../../../../../../utils/logger');

exports.main = async (req, res, next) => {
  
  const {COD_EMPRESA = '',COD_CLIENTE = '',TIP_DOCUMENTO = '', TIP_COMPROBANTE = ''} = req.body
  let valor  = req.body.valor ? req.body.valor : null;

  if(valor != 'null' && valor != undefined){
    valor = '%' +  valor.replace(' ', '%') + '%';
  }

  try {
    var sql = ` select d.*
                  from ( select c.nro_comprobante 
                              , c.ser_comprobante
                              , c.tip_comprobante
                              , to_char(c.fec_comprobante,'dd/mm/yyyy') fec_comprobante
                              , s.saldo_cuota tot_comprobante
                              , c.tip_cambio
                              , s.nro_cuota
                              , s.cod_moneda_cuota cod_moneda
                              , c.cod_subcliente             
                              , null nro_voucher
                          from vt_comprobantes_cabecera c
                              , cc_saldos s
                              , monedas m
                            where c.cod_empresa     = '${COD_EMPRESA}'
                              and c.cod_cliente     = '${COD_CLIENTE}'
                              and c.tip_comprobante = '${TIP_DOCUMENTO}'                             
                              and c.cod_empresa     = s.cod_empresa
                              and c.tip_comprobante = s.tip_comprobante
                              and c.ser_comprobante = s.ser_comprobante
                              and c.nro_comprobante = s.nro_comprobante                        
                              and nvl(s.saldo_cuota,0) > 0
                              and nvl(c.estado,'X' ) <> 'A' 
                              and c.cod_moneda = m.cod_moneda 
                              and nvl( c.ind_bloqueado , 'N') = 'N'
                              and nvl('${TIP_COMPROBANTE}','X')  <> 'REC'

                          union all

                          select c.nro_comprobante
                                , c.ser_comprobante
                                , c.tip_comprobante
                                , to_char(c.fec_comprobante,'dd/mm/yyyy') fec_comprobante
                                , s.saldo_cuota tot_comprobante
                                , c.tip_cambio
                                , s.nro_cuota
                                , s.cod_moneda_cuota cod_moneda
                                , c.cod_subcliente             
                                , null nro_voucher
                            from cc_anticipo_cliente c
                                , cc_saldos s
                                , monedas m
                            where c.cod_empresa     ='${COD_EMPRESA}'
                              and c.cod_cliente     ='${COD_CLIENTE}'
                              and c.tip_comprobante ='${TIP_DOCUMENTO}'
                              and c.cod_empresa     = s.cod_empresa
                              and c.tip_comprobante = s.tip_comprobante
                              and c.ser_comprobante = s.ser_comprobante
                              and c.nro_comprobante = s.nro_comprobante
                              and nvl(s.saldo_cuota,0) > 0
                              and nvl( c.estado,'X' )  = 'C' 
                              and nvl( c.ind_bloqueado , 'N') = 'N'
                              and c.cod_moneda = m.cod_moneda 
                                
                            UNION ALL
                            
                           select c.nro_comprobante     
                                , c.ser_comprobante     
                                , c.tip_comprobante     
                                , to_char(c.fec_comprobante,'dd/mm/yyyy') fec_comprobante
                                , saldo_cuota tot_comprobante
                                , tip_cambio
                                , nro_cuota
                                , cod_moneda
                                , c.cod_subcliente  
                                , c.voucher_nro nro_voucher
                            from cc_clientes_compra_procard c   
                            where c.cod_empresa     ='${COD_EMPRESA}'
                              and c.cod_cliente     ='${COD_CLIENTE}'
                              and c.tip_comprobante ='${TIP_DOCUMENTO}'
                              and nvl(c.saldo_cuota,0) > 0 
                         ) d
                    where (d.nro_comprobante  like '%' || :valor        || '%' or
                     upper(d.ser_comprobante) like '%' || upper(:valor) || '%' or :valor = 'null')
                      and rownum <= 20`;

    var data = {valor};
    const response = await db.Open(sql,data,true,req.headers.authuser,await crypto.decrypt(req.headers.authpass));
    res.status(200).json(response);
  } catch (error) {
    logger_error.error(`getNroDocumento | CCMOVCAJ ${error}`)
    console.log(error);
    next();
  }
}