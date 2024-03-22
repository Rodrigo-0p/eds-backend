const db          = require("../../../../../../connection/conn");
const crypto      = require("../../../../../../utils/crypto"   );
const {log_error} = require('../../../../../../utils/logger'   );

exports.main = async (req, res, next) => {
  let { COD_EMPRESA     = '',  COD_SUCURSAL      = '', NRO_COMPROBANTE      = '',
        TIP_COMPROBANTE = '',  SER_COMPROBANTE   = '', IND_COMPRA_LOCAL     = '',
        FEC_COMPROBANTE = '',  FEC_RECEPCION     = '', FEC_EMBARQUE         = '',
        COD_PROVEEDOR   = '',  COD_PROVEEDOR_ANT = '', COD_CONDICION_COMPRA = '',
        COD_MONEDA      = '',  COD_DEPOSITO      = '', NRO_TIMBRADO         = '',
        REFERENCIA      = '',  INDICE                , LIMITE } = req.body;
  try {
    let sql = `select EDS_CMFACTUR.listar_cabecera( :COD_EMPRESA
                                                  , :TIP_COMPROBANTE
                                                  , :SER_COMPROBANTE
                                                  , :NRO_COMPROBANTE
                                                  , :IND_COMPRA_LOCAL
                                                  , :COD_SUCURSAL
                                                  , :FEC_COMPROBANTE
                                                  , :FEC_RECEPCION
                                                  , :FEC_EMBARQUE
                                                  , :COD_PROVEEDOR
                                                  , :COD_PROVEEDOR_ANT 
                                                  , :COD_CONDICION_COMPRA 
                                                  , :COD_MONEDA  
                                                  , :COD_DEPOSITO 
                                                  , :NRO_TIMBRADO   
                                                  , :REFERENCIA  
                                                  , :INDICE
                                                  , :LIMITE 
                                                 ) as data from dual`;
    let data = {  COD_EMPRESA       , TIP_COMPROBANTE
               ,  SER_COMPROBANTE   , NRO_COMPROBANTE
               ,  IND_COMPRA_LOCAL  , COD_SUCURSAL
               ,  FEC_COMPROBANTE   , FEC_RECEPCION
               ,  FEC_EMBARQUE      , COD_PROVEEDOR
               ,  COD_PROVEEDOR_ANT , COD_CONDICION_COMPRA 
               ,  COD_MONEDA        , COD_DEPOSITO 
               ,  NRO_TIMBRADO      , REFERENCIA
               // *************************************
               , INDICE , LIMITE};

    let result = await db.Open(sql,data,true,req.headers.authuser,await crypto.decrypt(req.headers.authpass));   
    result.rows = result.rows.shift().DATA;
    res.status(200).json( result );
  } catch (error) {
    log_error.error(`listar_cabecera | EDS_CMFACTUR ${error}`)
    console.log(error);
    next();
  }
}