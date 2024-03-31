const db          = require("../connection/conn");
const oracledb    = require("oracledb");
const crypto      = require("./crypto");
const _           = require('underscore');
const {log_error} = require('./logger')

const PostValida = async(sql,params, req)=>{ 
    try {         
        // console.log(sql)
        // console.log(params)
        const response = await db.Open(sql, params, true ,req.headers.authuser, await crypto.decrypt(req.headers.authpass) );
        return response;
    } catch (error) {
        log_error.error(`PostValida ${error}`) 
        console.log(error);
    }
}
exports.validateCampo = async(content,valida,req)=>{
    let bandera = false;
    let p_mensaje = "";
    let data;
    for (let index = 0; index < content.length; index++) {
        const item = content[index];
        for (let x = 0; x < valida.length; x++) {
            const element = valida[x];
            if( item[element.campo] != null && item[element.campo] != undefined && item[element.campo] != ''){
                const in_params = element.in_params;
                const out_params = element.out_params;
                var sql = `BEGIN :ret := ${element.paquete}.${element.funcion}(`;
                for (let y = 0; y < in_params.length; y++) {
                    sql += `:${in_params[y]},`;
                }
                for (let y = 0; y < out_params.length; y++) {
                    sql += `:${out_params[y]},`;
                }
                sql += `:p_mensaje); END; \n`;
                var params = {};
                for (let y = 0; y < in_params.length; y++) {
                    params[in_params[y]] = item[in_params[y]];
                }
                for (let y = 0; y < out_params.length; y++) {
                    params[out_params[y]] = { dir: oracledb.BIND_OUT, type: element?.type?.[y] ? oracledb[element.type[y]] : oracledb.STRING, maxSize: 300};
                }
                params["p_mensaje"] = { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 300}
                params["ret"] = { dir: oracledb.BIND_OUT, type: oracledb.NUMBER, maxSize: 300 }
                data = await PostValida(sql,params,req);
                if(data.outBinds.ret == 0){
                    p_mensaje = data.outBinds.p_mensaje
                    bandera = true;
                    break;
                }
            }
        }
        if(bandera){
            break;
        }
    }
    return {valor:bandera,p_mensaje, data}
}
exports.validateRetorno = async(content,valida,req)=>{
    let data;
    for (let index = 0; index < content.length; index++) {
        const item = content[index];
        for (let x = 0; x < valida.length; x++) {
            const element = valida[x];
            const in_params = element.in_params;
            const out_params = element.out_params;
            var sql = `BEGIN :ret := ${element.paquete}.${element.funcion}(`;
            for (let y = 0; y < in_params.length; y++) {
                if(y == in_params.length - 1){
                    sql += `:${in_params[y]}`;
                }else{
                    sql += `:${in_params[y]},`;
                }
            }
            for (let y = 0; y < out_params.length; y++) {
                sql += `:${out_params[y]},`;
            }
            sql += `); END; \n`;
            var params = {};
            for (let y = 0; y < in_params.length; y++) {
                params[in_params[y]] = item[in_params[y]];
            }
            for (let y = 0; y < out_params.length; y++) {
                params[out_params[y]] = { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 300};
            }
            params["ret"] = { dir: oracledb.BIND_OUT, type: oracledb.NUMBER, maxSize: 300 } 
            data = await PostValida(sql,params,req);
        }
    }
    return data.outBinds.ret;
}
exports.validateRetornoString = async(content,valida,req)=>{
    let data;
    for (let index = 0; index < content.length; index++) {
        const item = content[index];
        for (let x = 0; x < valida.length; x++) {
            const element = valida[x];
            const in_params = element.in_params;
            const out_params = element.out_params;
            var sql = `BEGIN :ret := ${element.paquete}.${element.funcion}(`;
            for (let y = 0; y < in_params.length; y++) {
                if(y == in_params.length - 1){
                    sql += `:${in_params[y]}`;
                }else{
                    sql += `:${in_params[y]},`;
                }
            }
            for (let y = 0; y < out_params.length; y++) {
                sql += `:${out_params[y]},`;
            }
            sql += `); END; \n`;
            var params = {};
            for (let y = 0; y < in_params.length; y++) {
                params[in_params[y]] = item[in_params[y]];
            }
            for (let y = 0; y < out_params.length; y++) {
                params[out_params[y]] = { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 300};
            }
            params["ret"] = { dir: oracledb.BIND_OUT, type: oracledb[element.return_type], maxSize: 300 }
            data = await PostValida(sql,params,req);
        }
    }
    return data.outBinds.ret;
}
exports.validateProcedure = async(content,valida,req)=>{
    let data;
    for (let index = 0; index < content.length; index++) {
        const item = content[index];
        for (let x = 0; x < valida.length; x++) {
            const element = valida[x];
            const in_params = element.in_params;
            const out_params = element.out_params;
            var sql = `BEGIN ${element.paquete}.${element.funcion}(`;
            for (let y = 0; y < in_params.length; y++) {
                sql += `:${in_params[y]},`;
            }
            for (let y = 0; y < out_params.length; y++) {
                if(y == out_params.length - 1){
                    sql += `:${out_params[y]}`;
                }else{
                    sql += `:${out_params[y]},`;
                }
            }
            sql += `); END; \n`;
            var params = {};
            for (let y = 0; y < in_params.length; y++) {
                params[in_params[y]] = item[in_params[y]];
            }
            for (let y = 0; y < out_params.length; y++) {
                if( _.isUndefined( element?.type ) ){
                    params[out_params[y]] = { dir: oracledb.BIND_OUT, type: element?.out_type?.[out_params[y]] ? oracledb[element?.out_type?.[out_params[y]]] : oracledb.STRING, maxSize: 300};
                }else{
                    params[out_params[y]] = { dir: oracledb.BIND_OUT, type: element?.type?.[y] ? oracledb[element.type[y]] : oracledb.STRING, maxSize: 300};
                }
                // params[out_params[y]] = { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 300};
            }
            data = await PostValida(sql,params,req);
        }
    }
    return data;
}
exports.validateGlobalProcedure = async(content,valida,req)=>{
    let data;
    for (let index = 0; index < content.length; index++) {
        const item = content[index];
        for (let x = 0; x < valida.length; x++) {
            const element = valida[x];
            const in_params = element.in_params;
            const out_params = element.out_params;
            var sql = `BEGIN ${element.funcion}(`;
            for (let y = 0; y < in_params.length; y++) {
                sql += `:${in_params[y]},`;
            }
            if( out_params.length == 0) sql = sql.slice(0, sql.length -1);
            for (let y = 0; y < out_params.length; y++) {
                if(y == out_params.length - 1){
                    sql += `:${out_params[y]}`;
                }else{
                    sql += `:${out_params[y]},`;
                }
            }
            sql += `); END; \n`;
            var params = {};
            for (let y = 0; y < in_params.length; y++) {
                params[in_params[y]] = item[in_params[y]];
            }
            for (let y = 0; y < out_params.length; y++) {
                params[out_params[y]] = { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 300};
            } 
            data = await PostValida(sql,params,req);
        }
    }
    return data;
}
exports.validateGlobalFunction = async(content,valida,req)=>{ 
    let bandera = false;
    let p_mensaje = "";
    let data;
    for (let index = 0; index < content.length; index++) {
        const item = content[index];  
        for (let x = 0; x < valida.length; x++) {
            const element = valida[x];  
            if( item[element.campo] !== null && item[element.campo] !== undefined && item[element.campo] !== ''){ 
                const in_params = element.in_params;
                const out_params = element.out_params;
                var sql = `DECLARE\nret boolean;`
                sql += `BEGIN ret := ${element.funcion}(`;
                for (let y = 0; y < in_params.length; y++) {
                    sql += `:${in_params[y]},`;
                }
                for (let y = 0; y < out_params.length; y++) {
                    sql += `:${out_params[y]},`;
                }
                sql += `:p_mensaje); :ret := sys.diutil.bool_to_int(ret); END; \n`;
                var params = {};
                for (let y = 0; y < in_params.length; y++) {
                    params[in_params[y]] = item[in_params[y]];
                }
                for (let y = 0; y < out_params.length; y++) {
                    params[out_params[y]] = { dir: oracledb.BIND_OUT, type: element?.type?.[y] ? oracledb[element.type[y]] : oracledb.STRING, maxSize: 300};
                }
                params["p_mensaje"] = { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 300}
                params["ret"] = { dir: oracledb.BIND_OUT, type: oracledb.NUMBER, maxSize: 300 }
                data = await PostValida(sql,params,req);
                if(data.outBinds.ret == 0){
                    p_mensaje = data.outBinds.p_mensaje
                    bandera = true;
                    break;
                }
            }
        }
        if(bandera){
            break;
        }
    }
    return {valor:bandera,p_mensaje, data}
}

const ValidaNumero = (value) => {
    let valor;
    try {
        valor = parseFloat(value);
        if( _.isNaN(valor) ) valor = null;

        return valor;
    } catch (error) {
        return null;
    }
}

exports.validateBooleanFunction = async(content,valida,req)=>{
    let bandera = false;
    let p_mensaje = "";
    let data;
    for (let index = 0; index < content.length; index++) {
        const item = content[index];
        for (let x = 0; x < valida.length; x++) {
            const element = valida[x];
            const in_params = element.in_params;
            const out_params = element.out_params;
            var sql = `DECLARE\nret boolean;`
            sql += `BEGIN ret := ${element.paquete}${element.funcion}(`;
            for (let y = 0; y < in_params.length; y++) {
                sql += `\n\t:${in_params[y]},`;
            }
            for (let y = 0; y < out_params.length; y++) {
                sql += `\n\t:${out_params[y]},`;
            }
            sql += `:p_mensaje); :ret := sys.diutil.bool_to_int(ret); END; \n`;
            var params = {};
            for (let y = 0; y < in_params.length; y++) { 
                if( element?.bind_type?.[in_params[y]] === undefined ){                     
                    params[in_params[y]] = element?.in_type?.[in_params[y]] === 'NUMBER' ? ValidaNumero(item[in_params[y]]) : _.isNull(item[in_params[y]]) ? item[in_params[y]] : `${item[in_params[y]]}`;
                    // params[in_params[y]] = element?.in_type?.[in_params[y]] === 'NUMBER' ? ValidaNumero(item[in_params[y]]) : _.isNull(item[in_params[y]]) ? '' : `${item[in_params[y]]}`;
                }else{  
                    params[in_params[y]] = { 
                        dir: oracledb[`BIND_${element?.bind_type?.[in_params[y]]}`], 
                        type: !_.isUndefined(element?.in_type?.[in_params[y]]) ? oracledb[ element?.in_type?.[in_params[y]] ] : oracledb.STRING, 
                        val : element?.in_type?.[in_params[y]] == 'NUMBER' ? _.isNumber( ValidaNumero(item[in_params[y]]) ) ? ValidaNumero( item[in_params[y]] )
                            : null : _.isNull(item[in_params[y]]) ? item[in_params[y]] : `${item[in_params[y]]}` };  
                }
            }
            for (let y = 0; y < out_params.length; y++) {
                if( _.isUndefined( element?.type ) ){
                    params[out_params[y]] = { dir: oracledb.BIND_OUT, type: element?.out_type?.[out_params[y]] ? oracledb[element?.out_type?.[out_params[y]]] : oracledb.STRING, maxSize: 300};
                }else{
                    params[out_params[y]] = { dir: oracledb.BIND_OUT, type: element?.type?.[y] ? oracledb[element.type[y]] : oracledb.STRING, maxSize: 300};
                }
            }
            params["p_mensaje"] = { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 300}
            params["ret"] = { dir: oracledb.BIND_OUT, type: oracledb.NUMBER, maxSize: 300 }
            data = await PostValida(sql,params,req);
            if(data?.outBinds?.ret == 0){
                p_mensaje = data.outBinds.p_mensaje
                bandera = true;
                break;
            }
            if(data?.outBinds?.ret == undefined){
                p_mensaje = 'Error del valida';
                bandera = true;
                break;
            }
        }
        if(bandera){
            break;
        }
    }
    return {valor:bandera,p_mensaje, data}
}