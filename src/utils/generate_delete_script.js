const crypto  = require("./crypto");
const db      = require("../connection/conn");
const _       = require('underscore');

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
const getTableInfo = async(req, table_name) => {
  try {
    var sql =   `
                select column_name, data_type 
                from all_tab_columns
                where table_name = :table_name
                order by column_id
                `;
    const result  = await db.Open(sql,{ table_name }, true, req.headers.authuser, await crypto.decrypt(req.headers.authpass) );
    return result.rows;
  } catch (error) {
      console.log(error)
  }
}
const getTablePK = async(req, table_name) => {
  try {
    var sql =   `
                select cols.column_name, cols.position
                  from all_constraints cons, all_cons_columns cols
                 where cols.table_name = :table_name
                   and cons.constraint_type = 'P'
                   and cons.constraint_name = cols.constraint_name
                   and cons.owner = cols.owner
                   and cons.status = 'ENABLED'
                 order by cols.position
                `;
    const result  = await db.Open(sql,{ table_name }, true, req.headers.authuser, await crypto.decrypt(req.headers.authpass) );
    return result.rows;
  } catch (error) {
      console.log(error)
  }
}
exports.generate_delete = async(req, table_name, data, info, auxKey = [], omitKey = []) => {
  let sql = '';
  let content = data;
  let columns = await getTableInfo(req, table_name);
  if(content?.length > 0){
    let pks = await getTablePK(req, table_name);
    sql += `begin\n`;
    for (let i = 0; i < content.length; i++) {
      let vcolumn, vdatos;
      vcolumn = await auditoriaColumnas( columns );
      vdatos = await auditoriaValores( content[i], columns );
      sql += `delete from ${table_name}`;
      sql += `\n where`;
      for (let j = 0; j < pks.length; j++) {
        let column = columns.find( item => item.COLUMN_NAME == pks[j].COLUMN_NAME);

        let key = pks[j];
        let keyValue = {...key};

        if(_.contains( Object.keys(auxKey), keyValue.COLUMN_NAME ) ){
          keyValue.COLUMN_NAME = auxKey[keyValue.COLUMN_NAME];
        }

        if( !_.contains(omitKey, pks[j].COLUMN_NAME ) ){
          if(j == 0) sql += ` ${pks[j].COLUMN_NAME} = ${ valorNull(content[i][keyValue.COLUMN_NAME], column.DATA_TYPE) }`;
          else sql += `\n   and ${pks[j].COLUMN_NAME} = ${ valorNull(content[i][keyValue.COLUMN_NAME], column.DATA_TYPE) }`; 
        } 
      } 
      sql += `;\n`;
      sql += `${info.paquete}.borrar_registro( '${info.cod_empresa}' , '${info.cod_usuario}' , '${info.direccion_ip}' , '${vdatos}', '${table_name}', '${info.modulo}', '${vcolumn}' );\n`;
    }
    sql += `end;`;
  }
  return sql;
}