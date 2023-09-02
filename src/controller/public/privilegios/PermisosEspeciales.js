const conn        = require('../../../connection/conn');
const {log_error} = require('../../../utils/logger');

exports.PermisosEspeciales  = async (cod_usuario,password,next)=>{
    try {
       var sql =` select  * 
                    from  permisos_opciones c 
                    where c.cod_empresa = 1
                     and  c.cod_usuario = :p_cod_usuario
                     and  nvl(c.permiso,'N') = 'S'
                   `;
        let data = {p_cod_usuario:cod_usuario}
        const response = await conn.Open(sql,data,true,cod_usuario,password);
        return response.rows;
    } catch (error) {
        log_error.error(`PermisosEspeciales : ${error}`)
        console.log(error);
        next();
    }
}