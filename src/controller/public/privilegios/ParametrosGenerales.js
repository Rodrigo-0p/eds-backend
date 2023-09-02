const conn        = require('../../../connection/conn');
const {log_error} = require('../../../utils/logger');

exports.ParametrosGenerales = async (req, res, next)=>{
    const id = req.body.id;
    try {
        var sql =   `select valor from parametros_generales c where c.parametro = :id`;
        const response = await conn.Open(sql,{id},true,cod_usuario,password);
        return response.rows;
    } catch (error) {
        log_error.error(`ParametrosGenerales : ${error}`)
        console.log(error);
        next();
    }
}