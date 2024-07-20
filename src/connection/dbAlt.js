const oracledb         = require("oracledb");
oracledb.fetchAsString = [ oracledb.CLOB ];
require("dotenv").config();
process.env.ORA_SDTZ 	 = 'UTC';

const Open = async (username, password)=>{
	try {
    const connection = await oracledb.getConnection({
      user: username,
			password: password,
			connectString: process.env.DBURL + ":" + process.env.DBPORT + "/" + process.env.DBNAME,
     });
     return connection;
  } catch (error) {
    console.error(error);
  }
}
exports.Open = Open;