const oracledb       = require("oracledb");
const moment         = require('moment');
const crypto         = require("../../../../../../../utils/crypto");
const {log_error}    = require('../../../../../../../utils/logger');
require('dotenv').config()

const conn = async(req) => {
  try {
    let connection = await oracledb.getConnection({
      user: req.headers.authuser,
      password: await crypto.decrypt(req.headers.authpass),
      connectString: process.env.DBURL + ":" + process.env.DBPORT + "/" + process.env.DBNAME,
    }); 
    return connection
  } catch (error) {
    log_error.error(`${moment().format('DD/MM/YYYY HH:mm:ss')} | User = ${req.headers.authuser} | Open = ${error}` )
    console.error(error);
  }
}

module.exports = {
  conn
}