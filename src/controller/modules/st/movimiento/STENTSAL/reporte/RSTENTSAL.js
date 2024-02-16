const db                  = require("./conn");
const oracledb            = require("oracledb");
const crypto              = require("../../../../../../utils/crypto");
const {logger_error}      = require('../../../../../../utils/logger');

exports.main = async(req, res, next)=>{
  let {P_COD_EMPRESA = '',P_COD_SUCURSAL = '',P_NRO_ENT_SAL = ''}  = req.body;
  
  try {
    let sql = `select EDS_STENTSAL.r_stentsal( :P_COD_EMPRESA
                                             , :P_COD_SUCURSAL
                                             , :P_NRO_ENT_SAL
                                            ) as data from dual`;
    let data = {  P_COD_EMPRESA
                , P_COD_SUCURSAL
                , P_NRO_ENT_SAL
              };
    let result = await db.Open(sql,data,true,req.headers.authuser,await crypto.decrypt(req.headers.authpass));   
    result.rows = result.rows.shift().DATA;
    res.status(200).json(result);    
  } catch (error) {
    console.log(error);
    logger_error.error(`EDS_STENTSAL r_rentsal: ${error}`)    
    next();
  } 

}