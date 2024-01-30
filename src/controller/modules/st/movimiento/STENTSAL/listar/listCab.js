const db          = require("../../../../../../connection/conn");
const crypto      = require("../../../../../../utils/crypto"   );
const {log_error} = require('../../../../../../utils/logger'   );

exports.main = async (req, res, next) => {
  let { COD_EMPRESA         = '', COD_SUCURSAL        = '', NRO_ENT_SAL         = '',
        FEC_ENT_SAL         = '', COD_MOTIVO          = '', COD_DEPOSITO        = '',
        COD_PROVEEDOR       = '', COD_MONEDA          = '', ESTADO              = '',
        TIP_COMPROBANTE_REF = '', SER_COMPROBANTE_REF = '', NRO_COMPROBANTE_REF = '',
        INDICE , LIMITE } = req.body;

  let FEC_ENT_SAL_AUX = '';
  if(FEC_ENT_SAL  !== '' && FEC_ENT_SAL !== undefined && FEC_ENT_SAL !== null) FEC_ENT_SAL_AUX = `%${FEC_ENT_SAL.toLocaleUpperCase()}%`;
      
  try {
    let sql = `select EDS_STENTSAL.listar_cabecera( :COD_EMPRESA
                                                  , :COD_SUCURSAL
                                                  , :NRO_ENT_SAL
                                                  , :FEC_ENT_SAL_AUX
                                                  , :COD_MOTIVO
                                                  , :COD_DEPOSITO
                                                  , :COD_PROVEEDOR
                                                  , :COD_MONEDA
                                                  , :ESTADO
                                                  , :TIP_COMPROBANTE_REF
                                                  , :SER_COMPROBANTE_REF
                                                  , :NRO_COMPROBANTE_REF
                                                  , :INDICE
                                                  , :LIMITE 
                                                  ) as data from dual`;
    let data = { COD_EMPRESA
               , COD_SUCURSAL
               , NRO_ENT_SAL
               , FEC_ENT_SAL_AUX
               , COD_MOTIVO
               , COD_DEPOSITO
               , COD_PROVEEDOR
               , COD_MONEDA
               , ESTADO               
               , TIP_COMPROBANTE_REF
               , SER_COMPROBANTE_REF
               , NRO_COMPROBANTE_REF
               , INDICE
               , LIMITE};

    let result = await db.Open(sql,data,true,req.headers.authuser,await crypto.decrypt(req.headers.authpass));   
    result.rows = result.rows.shift().DATA;
    res.status(200).json( result );
  } catch (error) {
    log_error.error(`listar_cabecera | EDS_STENSAL ${error}`)
    console.log(error);
    next();
  }
}