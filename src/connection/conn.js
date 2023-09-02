const oracledb       = require("oracledb");
const {log_error} 	 = require('../utils/logger');
const moment         = require('moment');
require('dotenv').config();
process.env.ORA_SDTZ = 'UTC';
async function Open(sql, binds, autoCommit, username, password) {
	let cnn;
	try {
		cnn = await oracledb.getConnection({
			user: username,
			password: password,
			connectString: process.env.DBURL + ":" + process.env.DBPORT + "/" + process.env.DBNAME,
		});
		let result = await cnn.execute(sql, binds, { autoCommit, outFormat: oracledb.OBJECT });
		await cnn.close();
		return result;
	} catch (error) {
		log_error.error(`${moment().format('DD/MM/YYYY HH:mm:ss')} | User = ${username} | Open = ${error} | sql= ${sql} | binds = ${ JSON.stringify(binds) }` )
		console.log(error);
		return error;
	}
}
exports.Open = Open;