const oracledb    = require("oracledb");
const moment      = require('moment');
const {log_error} = require('../../../../../../utils/logger');

exports.Open = async(sql, binds, autoCommit, user, password) => {
  let content = [];
  let connection = await oracledb.getConnection({
    user,
    password,
    connectString: process.env.DBURL + ":" + process.env.DBPORT + "/" + process.env.DBNAME,
  }); 
  let options = { autoCommit, outFormat: oracledb.OBJECT }
  try {
    content = await connection.execute(sql, binds, options);
  } catch (error) {
    content = await error;
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (error) {
        log_error.error(`${moment().format('DD/MM/YYYY HH:mm:ss')} | User = ${autoCommit} | Open = ${error} | sql= ${sql} | binds = ${binds}` )
        console.error(error);
      }
    }
  }
  return content;
}