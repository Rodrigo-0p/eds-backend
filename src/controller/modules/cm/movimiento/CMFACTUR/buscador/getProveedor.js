const db                  = require("../../../../../../connection/conn");
const crypto              = require("../../../../../../utils/crypto");
const {logger_error}      = require('../../../../../../utils/logger')

exports.main = async (req, res, next) => {
  
  var cod_empresa = req.body.cod_empresa;
  var valor       = req.body.valor;
  if(valor != 'null' && valor != undefined){
    valor = '%' +  valor.replace(' ', '%') + '%';
  }
  try {
    var sql =  `  select *
                     from (
                           select pr.cod_proveedor,
                                  nvl( p.nombre, p.nomb_fantasia ) desc_proveedor,
                                  pr.exento,
                                  pr.cod_condicion_compra,
                                  pr.cod_condicion_compra cod_condicion_compra_ant,
                                  co.descripcion desc_condicion,
                                  pr.cod_moneda,
                                  mo.descripcion desc_moneda,
                                  mo.decimales,
                                  mo.tipo_cambio_dia tip_cambio,
                                  nvl(pr.nro_timbrado,'') nro_timbrado,
                                  --
                                  nvl( pr.ind_dif_precio, 'N' ) ind_dif_precio,
                                  pr.ind_odc,
                                  pr.cod_proveedor || '-' || p.nombre id
                            from  personas p
                              ,  cm_datos_proveedores pr
                              ,  ident_personas i
                              ,  cm_condiciones_compras co
                              ,  monedas mo
                          where  pr.cod_persona            = p.cod_persona
                            and  i.cod_persona(+)          = pr.cod_persona
                            and  i.cod_ident(+)            = 'TIM'
                          --
                            and  pr.cod_empresa           = co.cod_empresa(+)
                            and  pr.cod_condicion_compra  = co.cod_condicion_compra(+)
                            and  pr.cod_moneda            = mo.cod_moneda(+)
                          --
                            and  pr.cod_empresa           = :cod_empresa
                            
                            and (pr.cod_proveedor like '%' || :valor || '%' or upper(p.nombre) like '%' || upper(:valor) || '%' or :valor = 'null')
                            and  nvl(pr.estado,'A') = 'A' 
                          group by pr.cod_proveedor,
                                    p.nombre,
                                    pr.cod_condicion_compra,
                                    co.descripcion,
                                    mo.descripcion,
                                    pr.cod_moneda,
                                    mo.decimales,
                                    mo.tipo_cambio_dia,
                                    p.nomb_fantasia,
                                    pr.exento,
                                    pr.ind_odc,
                                    pr.vencimiento_timbrado,
                                    nvl( pr.ind_dif_precio, 'N' ),
                                    pr.ind_odc,
                                    pr.nro_timbrado
                          order by lpad(pr.cod_proveedor, 10, '0') asc
                        )
                  where rownum <= 20 `;
    var data = {cod_empresa,valor};
    const response = await db.Open(sql,data,true,req.headers.authuser,await crypto.decrypt(req.headers.authpass));    
    res.status(200).json(response);
  } catch (error) {
    logger_error.error(`getProveedor | cmfactur  ${error}`)
    console.log(error);
    next();
  }
}