const db          = require("../../../../../../connection/conn");
const oracledb    = require("oracledb");
const crypto      = require("../../../../../../utils/crypto");
const {log_error} = require('../../../../../../utils/logger');
exports.main = async (req, res, next)  => {
const { cod_empresa, cod_cliente, cod_subcliente } = req.body;
console.log( req.body );
const { valor } = req.body;
	try {
		var sql =   `  select c.cod_vendedor, c.nombre desc_vendedor
										 from fvv_vendedores_clientes c
										where c.cod_empresa = :cod_empresa
											and c.cod_cliente = :cod_cliente
											and c.cod_subcliente = :cod_subcliente
											and c.ind_per_limpieza = 'N'
											and (c.cod_vendedor like '%' || :valor || '%' or upper(c.desc_vendedor) like '%' || upper(:valor) || '%' or upper(c.nombre) like '%' || upper(:valor) || '%' or :valor = 'null')
											and nvl(c.estado,'I') = 'A' 
											and rownum <= 100
										order by lpad(c.cod_vendedor, 10, '0') asc
								`;
		var data = {cod_empresa, cod_cliente, cod_subcliente, valor};
		const response = await db.Open(sql,data,true,req.headers.authuser,await crypto.decrypt(req.headers.authpass));
		res.status(200).json(response);
	} catch (e) {
		log_error.error(`getVendedor | vtfactur ${e}`)
		console.log(e);
		next();
	}
}