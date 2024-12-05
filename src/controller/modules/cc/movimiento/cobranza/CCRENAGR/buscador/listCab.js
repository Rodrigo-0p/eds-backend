const db          = require("../../../../../../../connection/conn");
const crypto      = require("../../../../../../../utils/crypto"   );
const {log_error} = require('../../../../../../../utils/logger'   );

const formatDateForOracle = (date) => {
  const d     = new Date(date);
  const year  = d.getUTCFullYear();
  const month = ('0' + (d.getUTCMonth() + 1)).slice(-2);
  const day   = ('0' + d.getUTCDate()).slice(-2);
  return day+'/'+month+'/'+year;
}

exports.main = async (req, res, next) => {
  let { COD_EMPRESA     = ""   , FCO             ="N", CHE          ="N",
        FCR             = "N"  , ND              ="N", TAR          ="N", 
        VEN             = "N"  , NRO_CUENTA      ="" , COD_CLIENTE  ="" , 
        FECHA_DESDE     = false, FECHA_HASTA     = false, 
        TIP_COMPROBANTE = ''   , FEC_COMPROBANTE = '',
        NRO_COMPROBANTE = ''   
      } = req.body;
      
  try {
    let sql =` select c.tip_comprobante
                    , c.ser_comprobante
                    , c.nro_comprobante
                    , c.nro_factura_inpasa
                    , c.cod_cliente
                    , c.cod_subcliente
                    , c.cod_cliente_ref
                    , cod_zona
                    , c.desc_zona
                    , c.desc_cliente
                    , c.desc_subcliente
                    , c.fec_vencimiento
                    , c.nro_cuota
                    , to_char(c.fec_comprobante,'dd/mm/yyyy') fec_comprobante
                    , c.nro_cuenta_cliente
                    , c.cod_banco_cliente
                    , c.nro_cuenta
                    , c.cod_moneda
                    , c.siglas
                    , c.total
                  --  , to_char(c.total, 'FM9999999990.' || RPAD('0', m.cod_moneda, '0')) as total  
                 FROM ccv_pendiente_cobranza_vend c
                    , monedas m                 
                WHERE c.cod_moneda = m.cod_moneda
                  AND c.cod_empresa = :COD_EMPRESA
                  AND c.cod_cliente = :COD_CLIENTE

                  AND (c.tip_comprobante = :TIP_COMPROBANTE  or :TIP_COMPROBANTE is null )
                  AND (c.nro_comprobante = :NRO_COMPROBANTE  or :NRO_COMPROBANTE is null )
                  AND (to_char(c.fec_comprobante,'dd/mm/yyyy') = :FEC_COMPROBANTE or :FEC_COMPROBANTE is null )
                  
              `;
    const data = { COD_EMPRESA, COD_CLIENTE, TIP_COMPROBANTE, NRO_COMPROBANTE, FEC_COMPROBANTE};

    if (FECHA_DESDE && FECHA_HASTA) {
      sql += ' AND c.fec_comprobante BETWEEN TO_DATE(:FECHA_DESDE, \'DD/MM/YYYY\') AND TO_DATE(:FECHA_HASTA, \'DD/MM/YYYY\')';
      data.FECHA_DESDE = formatDateForOracle(FECHA_DESDE);
      data.FECHA_HASTA = formatDateForOracle(FECHA_HASTA);
    }

    let conditions = [];

    if (FCO === 'S')  conditions.push(`c.tip_comprobante IN ('FCO', 'ECO', 'PRE')`);    
    if (FCR === 'S')  conditions.push(`c.tip_comprobante IN ('FCR', 'ECR')`);
    if (VEN === 'S')  conditions.push(`c.tip_comprobante = 'VEN'`);    
    if (ND  === 'S')  conditions.push(`c.tip_comprobante = 'ND'`);
    if (TAR === 'S')  conditions.push(`c.tip_comprobante = 'TAJ'`);
    if (CHE === 'S' && NRO_CUENTA) {
      conditions.push(`c.tip_comprobante = 'CHE' AND nro_cuenta = :NRO_CUENTA`);
      data.NRO_CUENTA = NRO_CUENTA;
    }    
    if (conditions.length > 0) sql += ' AND (' + conditions.join(' OR ') + ')';

    let result = await db.Open(sql,data,true,req.headers.authuser,await crypto.decrypt(req.headers.authpass));   
    res.status(200).json(result);
  } catch (error) {
    log_error.error(`listar_cabecera | EDS_CCRENAGR ${error}`)
    console.log(error);
    next();
  }
}