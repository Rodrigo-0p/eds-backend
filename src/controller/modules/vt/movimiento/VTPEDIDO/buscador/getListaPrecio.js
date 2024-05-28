const db          = require("../../../../../../connection/conn");
const oracledb    = require("oracledb");
const crypto      = require("../../../../../../utils/crypto");
const {log_error} = require('../../../../../../utils/logger');
exports.main = async (req, res, next)  => {
	const { cod_empresa, cod_cliente, cod_subcliente, cod_vendedor } = req.body;
	const { valor } = req.body;
	try {
		var sql =   `  select c.cod_lista_precio, c.descripcion desc_lista_precio
										 from ( select descripcion, cod_lista_precio
														  from ccv_lista_precio_cliente
														 where cod_empresa = :cod_empresa
															 and cod_cliente = :cod_cliente
															 and cod_subcliente = :cod_subcliente
															 and cod_vendedor = :cod_vendedor
					
					                   union all
					
														select c.descripcion, c.cod_lista_precio
															from vt_precios_fijos_cab c, cc_cliente_list_prec cl
														 where cl.cod_empresa = :cod_empresa
															 and cl.cod_cliente = :cod_cliente
															 and cl.cod_subcliente = :cod_subcliente
															 and cl.cod_empresa = c.cod_empresa
															 and cl.cod_lista_precio = c.cod_lista_precio
															 and nvl(c.estado, 'A') <> 'I'
															 and nvl(cl.estado, 'A') <> 'I'
													) c 
									 where ( c.cod_lista_precio like '%'||:valor||'%' or upper( c.descripcion) like '%'||upper(:valor)||'%' or :valor = 'null')
	                 group by descripcion, cod_lista_precio 
								`;
		var data = {cod_empresa, cod_cliente, cod_subcliente, cod_vendedor, valor};
		const response = await db.Open(sql,data,true,req.headers.authuser,await crypto.decrypt(req.headers.authpass));
		res.status(200).json(response);
	} catch (e) {
		log_error.error(`getListaPrecio | vtfactur ${e}`)
		console.log(e);
		next();
	}
}