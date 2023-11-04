const crypto = require("./crypto");
const db     = require("../connection/conn");
const _      = require('underscore');
const {log_error}      = require('./logger');
const moment = require('moment');

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
const getTableInfo = async(req, table_name) => {
  try {
    var sql = `
                select column_name, data_type 
                from all_tab_columns
                where table_name = :table_name
                order by column_id
              `;
    const result  = await db.Open(sql,{ table_name }, true, req.headers.authuser, await crypto.decrypt(req.headers.authpass) );  
    return result.rows;
  } catch (error) {
    console.log(error)
    const ip         = req.headers['cf-connecting-ip'] || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    var direccion_ip = ip.replace("::ffff:","");
    log_error.error(`${moment().format('DD/MM/YYYY HH:mm:ss')} | user ${req.headers.authuser} | IP${direccion_ip} | error ${error}`)
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
    const ip         = req.headers['cf-connecting-ip'] || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    var direccion_ip = ip.replace("::ffff:","");
    log_error.error(`${moment().format('DD/MM/YYYY HH:mm:ss')} | user ${req.headers.authuser} | IP${direccion_ip} | error ${error}`)
  }
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
    log_error.error(`generate_update => comparar => aux:${aux} - data:${data} - ${error}`)
  }
  
}
exports.generate_update = async(req, table_name, data, auxData, auxKey = [], opcion = {} ) => {
  let sql = '';
  let content = data.filter( item => item.updated );

  let array_opcion = Object.keys(opcion);
  if(content.length > 0){
    let columns = await getTableInfo(req, table_name);
    let pks = await getTablePK(req, table_name);
    let XRows = [];
    for (let index = 0; index < content.length; index++) {
      const element = content[index];
      let aux = auxData.filter( item => { 
        return item.ID === element.ID  
      })

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
      for (let i = 0; i < pks.length; i++) {
        let key = pks[i];
        let keyValue = {...key};
        const type = columns.find(item => item.COLUMN_NAME == key.COLUMN_NAME ); 
        if(_.contains( Object.keys(auxKey), keyValue.COLUMN_NAME ) ){
          keyValue.COLUMN_NAME = auxKey[keyValue.COLUMN_NAME];
        }
        if(i == 0) sql += `${key.COLUMN_NAME} = ${ valorNull(element[keyValue.COLUMN_NAME], type.DATA_TYPE ) } `;
        else sql += `\n   and ${key.COLUMN_NAME} = ${ valorNull(element[keyValue.COLUMN_NAME], type.DATA_TYPE ) } `;
      }
      sql += `;\n`;
    }
    if(XRows.length > 0) sql += `end;`;
  }
  return sql;
}
/*
==============================
  FUNCION DE UPDATE - IMPORT
==============================
*/
const getTableInfoTest = async(req, table_name, columns) => {
  let col = [];
  for (let index = 0; index < columns.length; index++) {
      col.push("'" + columns[index] + "'");
  }
  col = col.toString();
  col = '(' + col + ')';
  try {
    var sql =   `
                select column_name, data_type 
                from all_tab_columns
                where table_name = :table_name
                  and column_name in ${col}
                order by column_id
                `;
    const result  = await db.Open(sql,{ table_name }, true, req.headers.authuser, await crypto.decrypt(req.headers.authpass) );
    return result.rows;
  } catch (error) {
    console.log(error)
    const ip         = req.headers['cf-connecting-ip'] || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    var direccion_ip = ip.replace("::ffff:","");
    log_error.error(`${moment().format('DD/MM/YYYY HH:mm:ss')} | user ${req.headers.authuser} | IP${direccion_ip} | error ${error}`)
  }
}
exports.generate_update_import = async(req, table_name, data, columns) => {
  let sql = '';
  let content = data;
  if(content.length > 0){
    let col = await getTableInfoTest(req, table_name, columns);
    let pks = await getTablePK(req, table_name);
    let array_pks = []
    for (let index = 0; index < pks.length; index++) {
        array_pks.push(pks[index].COLUMN_NAME)
    }
    let col_pks = await getTableInfoTest(req, table_name, array_pks);
    sql += `begin\n`;
    for (let index = 0; index < content.length; index++) {
      sql += `update ${table_name}`;
      sql += `\n   set `;
      const element = content[index];
      for (let i = 0; i < col.length; i++) {
        if(i == 0) sql += `${col[i].COLUMN_NAME} = ${ valorNull(element[col[i].COLUMN_NAME], col[i].DATA_TYPE ) } `;
        else sql += `\n     , ${col[i].COLUMN_NAME} = ${ valorNull(element[col[i].COLUMN_NAME], col[i].DATA_TYPE ) } `;
      }
      sql += `\n where `;
      for (let i = 0; i < col_pks.length; i++) {
        const key = col_pks[i];
        if(i == 0) sql += `${key.COLUMN_NAME} = ${ valorNull(element[key.COLUMN_NAME], key.DATA_TYPE ) } `;
        else sql += `\n   and ${key.COLUMN_NAME} = ${ valorNull(element[key.COLUMN_NAME], key.DATA_TYPE ) } `;
      }
      sql += `;\n`;
    }
    sql += `end;`;
  }
  return sql;
}