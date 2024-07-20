const { validateBooleanFunction } = require('../../../../../../../../utils/validate');
const {log_error}                 = require('../../../../../../../../utils/logger');
const _                           = require('underscore')

exports.main = async (req, res, next)  => {

const {TIP_COMPROBANTE_REF = '',SER_COMPROBANTE_REF = '', COD_EMPRESA= ''}	 = req.body;
let NRO_COMPROBANTE_REF = req.body.valor ? req.body.valor : ''
let content 	 = [{COD_EMPRESA, TIP_COMPROBANTE_REF, SER_COMPROBANTE_REF, NRO_COMPROBANTE_REF}];
let in_params  = content.map( item => { return _.keys(item) });  
var valida 		 = [{
    campo			 : 'NRO_COMPROBANTE_REF'      ,
    paquete		 : 'EDS_CCNCRDEF.'    ,
    funcion		 : 'VALIDA_NROCOMPREF',
    in_params  : in_params[0],
    out_params : ['CON_NCE'            , 'COD_ZONA'        , 'COD_VENDEDOR'      , 'VENDEDOR_PERSONA'   ,
                  'COD_CONDICION_VENTA', 'COD_LISTA_PRECIO', 'COD_MONEDA'        , 'COD_DEPOSITO'       ,
                  'NOM_CLIENTE'        , 'DIR_CLIENTE'     , 'RUC'               , 'CI'                 ,
                  'SER_REFERENCIA'     , 'TIP_REFERENCIA'  , 'NRO_REFERENCIA'    , 'COD_MOTIVO_NCR'     ,
                  'IND_TELEV'          , 'COD_SUPERVISOR'  , 'SUPERVISOR_PERSONA', 'TEL_CLIENTE'        ,
                  'NOM_CLIENTE'        , 'ESTADO'          , 'OBSERVACION'       , 'NRO_NCR_CLIENTE'    ,
                  'IND_VENTA'          , 'COD_MONEDA_REF'  , 'TIP_CAMBIO_REF'    , 'TOT_COMPROBANTE_REF' 
    ],
   }];
  try {
    var response = await validateBooleanFunction(content, valida, req);
    res.status(200).json(response.data);
  } catch (error) {
    log_error.error(`EDS_CCNCRDEF: VALIDA_NROCOMPREF : ${error}`);
    console.error('EDS_CCNCRDEF: VALIDA_NROCOMPREF   : ',error)
    next()
  }
}