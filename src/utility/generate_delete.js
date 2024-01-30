const _ = require('underscore');
const auditoriaValores = async(data, columns) =>{
  var datos_viejos = "";
  for (let i = 0; i < columns.length; i++) { 
    if(data[columns[i]?.COLUMN_NAME] != null) datos_viejos += data[columns[i]?.COLUMN_NAME] + "|";
    else datos_viejos += '' + "|";
  }
  return datos_viejos.substring(0,datos_viejos.length - 1);
}
const auditoriaColumnas = async(columns) =>{
  var result = "";
  for (let i = 0; i < columns.length; i++) {
    const element = columns[i];
    result += element.COLUMN_NAME.toLowerCase() + ",";
  }
  return result.substring(0,result.length - 1);
}
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
      if(_.contains(['VARCHAR','VARCHAR2','DATE'], type )){
          data = `'${data}'`;
      }
  }
  return data;
}
exports.generate_delete = async(table_name, data, info, column, key) => {
  let sql = '';
  let content = data;
  if(content?.length > 0){
    let pks = key; 
    sql += `begin\n`;
    for (let i = 0; i < content.length; i++) {
      let vcolumn, vdatos;
      vcolumn = await auditoriaColumnas( column );
      vdatos = await auditoriaValores( content[i], column );
      sql += `delete from ${table_name}`;
      sql += `\n where `;
      if( !_.isUndefined(content[i]['ORACLE_ROWID']) ){
        sql += `rowid = '${content[i]['ORACLE_ROWID']}' `;
      } else {
        for (let j = 0; j < pks.length; j++) {
          let col = column.find( item => item.COLUMN_NAME == pks[j].COLUMN_NAME);
          let key = pks[j];
          let keyValue = {...key}; 
          if(j == 0) sql += ` ${pks[j].COLUMN_NAME} = ${ valorNull(content[i][keyValue.COLUMN_NAME], col.DATA_TYPE) }`;
          else sql += `\n   and ${pks[j].COLUMN_NAME} = ${ valorNull(content[i][keyValue.COLUMN_NAME], col.DATA_TYPE) }`;  
        } 
      } 
      sql += `;\n`;
      sql += `${info.paquete}.borrar_registro( '${info.cod_empresa}' , '${info.cod_usuario}' , '${info.direccion_ip}' , '${vdatos}', '${table_name}', '${info.modulo}', '${vcolumn}' );\n`;
    }
    sql += `end;`;
  }
  return sql;
}