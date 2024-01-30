const _ = require('underscore');
const valorNull = (value, type) => {
  var data = value;
  if(_.isNull(data)){
    return data;
  }
  if(_.isUndefined(value) || data.length === 0){
    if(_.contains(['NUMBER'], type )){
      data = null;
    }else{
      data = "''";
    }
  }else{
    if(_.contains(['VARCHAR','VARCHAR2'], type )){
      data = `'${data}'`;
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
      if(data.toString().trim().length === 0){
        data = null;
      }
    }
  }
  return data;
}
const comparar = async(data, aux, columns) => { 
  let content = {};
  try {
    for (let i = 0; i < columns.length; i++) {
      const column = columns[i];
      if(data[column.COLUMN_NAME] != aux[column.COLUMN_NAME]){
        content = {...content, [column.COLUMN_NAME]:  data[column.COLUMN_NAME] };
      }
    } 
    if( Object.keys(content).length == 0 ) return []; else  return [ content ];
  } catch (error) {
    console.log(error);
  }
}
exports.generate_update = async( table_name, data, auxData, auxKey = [], opcion = {}, tableColumn, tablePrimaryKey ) => {
  let sql = '';
  let content = data.filter( item => item.updated );
  console.log("🚀 ~ file: generate_update_script.js:102 ~ exports.generate_update=async ~ content:", content.length)
  let array_opcion = Object.keys(opcion);
  if(content.length > 0){
    let columns = tableColumn;
    let pks = tablePrimaryKey;
    let XRows = [];
    for (let index = 0; index < content.length; index++) {
      const element = content[index];
      let aux = auxData.filter( item => { 
        return item.ID == element.ID  
      });
      let datos_modificados = await comparar( element, aux[0], columns );
      if( datos_modificados.length > 0 ) XRows = [ ...XRows, element];
    }
    if(XRows.length > 0) sql += `begin \n`;
    for (let index = 0; index < XRows.length; index++) {
      sql += `update ${table_name}`;
      sql += `\n   set `;
      const element = XRows[index];
      let aux = auxData.filter( item => item.ID == element.ID  );
      let datos_modificados = await comparar( element, aux[0], columns );
      let keys = Object.keys(datos_modificados[0]);
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const type = columns.find(item => item.COLUMN_NAME == key );
        if(_.contains(array_opcion, key )){
          if(i == 0) sql += `${key} = ${ opcion[key] } `;
          else sql += `\n     , ${key} = ${ opcion[key] } `;
        }else{
          if(i == 0) sql += `${key} = ${ valorNull(element[key], type.DATA_TYPE ) } `;
          else sql += `\n     , ${key} = ${ valorNull(element[key], type.DATA_TYPE ) } `;
        }      
      }
      sql += `\n where `;
 
      if( !_.isUndefined(element['ORACLE_ROWID']) ){
        sql += `rowid = '${element['ORACLE_ROWID']}' `;
      } else {
        for (let i = 0; i < pks.length; i++) {
          let key = pks[i];
          let keyValue = {...key};
          const type = columns.find(item => item.COLUMN_NAME == key.COLUMN_NAME ); 
          if(_.contains( Object.keys(auxKey), keyValue.COLUMN_NAME ) ){
            keyValue.COLUMN_NAME = auxKey[keyValue.COLUMN_NAME];
          }
          if(_.contains(array_opcion, key.COLUMN_NAME )){
            if(i == 0) sql += `${key.COLUMN_NAME} = ${ opcion[key.COLUMN_NAME] } `;
            else sql += `\n   and ${key.COLUMN_NAME} = ${ opcion[key.COLUMN_NAME] } `;
          }else{
            if(i == 0) sql += `${key.COLUMN_NAME} = ${ valorNull(element[keyValue.COLUMN_NAME], type.DATA_TYPE ) } `;
            else sql += `\n   and ${key.COLUMN_NAME} = ${ valorNull(element[keyValue.COLUMN_NAME], type.DATA_TYPE ) } `;
          } 
        }
      } 
      sql += `;\n`;
    }
    if(XRows.length > 0) sql += `end;`;
  }
  return sql;
}