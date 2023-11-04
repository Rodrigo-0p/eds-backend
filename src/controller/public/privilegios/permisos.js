const conn        = require('../../../connection/conn');
const {log_error} = require('../../../utils/logger');

exports.permisos_menu = async (cod_usuario,password,next)=>{
    try {
        var sql =   `  select c.*
                            from bsv_acceso_sistema c
                        where cod_usuario =:p_cod_usuario
                            and nvl(c.mostrar_menu  , 'N') = 'S'
                        order by orden_padre
                            , orden_menu
                            , orden_nodo
                            , orden_forma
                    `;
        let data = {p_cod_usuario:cod_usuario}
        const response = await conn.Open(sql,data,true,cod_usuario,password);
        return response.rows;
    } catch (error) {
        log_error.error(`permisos_menu: ${error}`)
        console.log(error);
        next();
    }
}