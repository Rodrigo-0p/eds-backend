const conn        = require('../../../connection/conn');
const {log_error} = require('../../../utils/logger');

exports.PermisosdeGrupo = async (cod_usuario,password,next)=>{
    try {
        var sql =   `  select u.cod_usuario
                            , g.cod_grupo
                            , a.cod_modulo
                            , a.nom_forma
                            , a.puede_insertar
                            , a.puede_borrar
                            , a.puede_actualizar
                            , a.puede_consultar
                        from bs_usuarios u
                            , grupos_usuarios g
                            , accesos_grupos a
                        where u.cod_grupo      = g.cod_grupo
                        and g.cod_grupo        = a.cod_grupo
                        and nvl(u.estado, 'I') = 'A'
                        and u.cod_usuario      =:p_cod_usuario
                    `;
        let data = {p_cod_usuario:cod_usuario}
        const response = await conn.Open(sql,data,true,cod_usuario,password);
        return response.rows;
    } catch (error) {
        log_error.error(`PermisosdeGrupo: ${error}`)
        console.log(error);
        next();
    }
}