const db          = require("../../../../../../connection/conn");
const oracledb    = require("oracledb");
const crypto      = require("../../../../../../utils/crypto");
const {log_error} = require('../../../../../../utils/logger');
exports.main = async (req, res, next)  => {
const { cod_empresa, cod_cliente, cod_subcliente } = req.body;
const { valor } = req.body;
	try {
		// var sql =   `  select c.cod_vendedor, c.nombre desc_vendedor
		// 								 from fvv_vendedores_clientes c
		// 								where c.cod_empresa = :cod_empresa
		// 									and c.cod_cliente = :cod_cliente
		// 									and c.cod_subcliente = :cod_subcliente
		// 									and c.ind_per_limpieza = 'N'
		// 									and (c.cod_vendedor like '%' || :valor || '%' or upper(c.desc_vendedor) like '%' || upper(:valor) || '%' or upper(c.nombre) like '%' || upper(:valor) || '%' or :valor = 'null')
		// 									and nvl(c.estado,'I') = 'A' 
		// 									and rownum <= 100
		// 								order by lpad(c.cod_vendedor, 10, '0') asc
		// 						`;
		var sql  = ` select v.cod_vendedor, p.nombre desc_vendedor 
		               from vt_vendedores v, personas p 
								  where v.cod_persona = p.cod_persona
									  and v.cod_empresa = :cod_empresa
									  and (v.cod_vendedor like '%' || :valor || '%' or upper(p.nombre) like '%' || upper(:valor) || '%' or :valor = 'null')
		                and nvl(v.activo,'N') = 'S' `
		var data = {cod_empresa, valor}; 
		const response = await db.Open(sql,data,true,req.headers.authuser,await crypto.decrypt(req.headers.authpass));
		res.status(200).json(response);
	} catch (e) {
		log_error.error(`getVendedor | vtfactur ${e}`)
		console.log(e);
		next();
	}
}