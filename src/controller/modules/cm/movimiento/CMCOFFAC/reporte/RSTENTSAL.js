const db            = require("./conn");
const oracledb      = require("oracledb");
const crypto        = require("../../../../../../utils/crypto");
const {log_error}   = require('../../../../../../utils/logger');

exports.main = async(req, res, next)=>{
  let {P_COD_EMPRESA = '',P_TIP_COMPROBANTE = '', P_SER_COMPROBANTE = '', P_NRO_COMPROBANTE = ''}  = req.body;

  try {
    let sql = `select EDS_CMCOFFAC.r_cmcoffac( :P_COD_EMPRESA
                                             , :P_TIP_COMPROBANTE
                                             , :P_SER_COMPROBANTE
                                             , :P_NRO_COMPROBANTE                                             
                                            ) as data from dual`;
    let data = {  P_COD_EMPRESA
                , P_TIP_COMPROBANTE
                , P_SER_COMPROBANTE
                , P_NRO_COMPROBANTE
              };
    let result = await db.Open(sql,data,true,req.headers.authuser,await crypto.decrypt(req.headers.authpass));   
    result.rows = result.rows.shift().DATA;
    res.status(200).json(result);    
  } catch (error) {
    console.log(error);
    log_error.error(`EDS_CMCOFFAC r_cmcoffac: ${error}`)    
    next();
  } 
}