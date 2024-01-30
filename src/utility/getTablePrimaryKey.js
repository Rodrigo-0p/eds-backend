const dbConfig = require('../connection/dbconfig');
const oracledb = require("oracledb");
const main = async() => {
  let argv = process.argv.slice(2);
  let table_name = argv[0];
  let connection;
  try {
    var sql = `
               select cols.column_name, cols.position
                 from all_constraints cons, all_cons_columns cols
                where cols.table_name = :table_name
                  and cons.constraint_type = 'P'
                  and cons.constraint_name = cols.constraint_name
                  and cons.owner = cols.owner
                  and cons.status = 'ENABLED'
                order by cols.position
              `;
    connection = await oracledb.getConnection({
      ...dbConfig,
      user: argv[1],
      password: argv[2]
    }); 
    result = await connection.execute(
      sql,
      {table_name},
      { autoCommit: false, outFormat: oracledb.OBJECT  }  // commit once for all DML in the script
    );
    console.log(result);
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