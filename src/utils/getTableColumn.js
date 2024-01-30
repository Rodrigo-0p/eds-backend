const dbConfig = require('../connection/dbconfig');
const oracledb = require("oracledb");
const main = async() => {
  let argv = process.argv.slice(2);
  let table_name = argv[0];
  let connection;
  try {
    var sql = `
                select column_name, data_type 
                from all_tab_columns
                where table_name = :table_name
                order by column_id
              `;
    connection = await oracledb.getConnection({
      ...dbConfig,
      user: argv[1],
      password: argv[2]
    }); 
    result = await connection.execute(
      sql,
      {table_name},
      { autoCommit: false, outFormat: oracledb.OBJECT }  // commit once for all DML in the script
    );
    console.log( JSON.stringify(result.rows) );
  } catch (error) {
    console.log(error);
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
}

main()