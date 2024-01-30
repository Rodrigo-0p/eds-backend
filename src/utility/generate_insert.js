const _ = require('underscore');
const valorNull = (value, type) => {
  var data = value;
  if(_.isNull(data)){
    return data;
  }
  if(_.isUndefined(value) || data?.toString()?.trim()?.length === 0){
    if(_.contains(['NUMBER'], type )){
      data = null;
    }else{
      data = "''";
    }
  }else{
    if(_.contains(['VARCHAR','VARCHAR2'], type )){
      data = `'${data.toString().replace("'",'`')}'`;
    }
    if(_.contains(['DATE'], type )){
      if(data.length == 10){
        data = `to_date('${data}','dd/mm/yyyy')`;
      }else{
        data = `to_date('${data}','dd/mm/yyyy hh24:mi:ss')`;
      }
    }
    if(_.contains(['NUMBER'], type )){
      if(data.toString().indexOf(",") > -1){
        data = data.replace(',','.');
      }
    }
  }
  return data;
}
exports.generate_insert = async(table_name, data, opcion, tableColumn) => {
  var sql = '';
  let content = data.filter( item => item.inserted );
  let array_opcion = Object.keys(opcion);
  if(content.length > 0){
    let columns = tableColumn;
    sql = "insert all";
    for (let index = 0; index < content.length; index++) {
      const element = content[index];
      sql += `\n into ${table_name} (`;
      for (let i = 0; i < columns.length; i++) {
        const column = columns[i];
        if(i == 0) sql += `\n\t\t  ${column.COLUMN_NAME}`;
        else sql += `\n\t\t, ${column.COLUMN_NAME}`;
      }
      sql += `)`;
      sql += `\nvalues(`
      for (let i = 0; i < columns.length; i++) {
        const column = columns[i];
        if(_.contains(array_opcion, column.COLUMN_NAME )){
          if(i == 0) sql += `\n\t\t  ${ opcion[column.COLUMN_NAME] }`;
          else sql += `\n\t\t, ${ opcion[column.COLUMN_NAME] }`;
        }else{
          if(i == 0) sql += `\n\t\t  ${valorNull(element[column.COLUMN_NAME], column.DATA_TYPE )}`;
          else sql += `\n\t\t, ${valorNull(element[column.COLUMN_NAME], column.DATA_TYPE )}`;
        }
      }
      sql += `)`;
    }
    sql += `\nselect * from dual`;
  }
  return sql;
}