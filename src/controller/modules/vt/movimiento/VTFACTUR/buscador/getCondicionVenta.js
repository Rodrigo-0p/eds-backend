const db          = require("../../../../../../connection/conn");
const crypto      = require("../../../../../../utils/crypto");
const {log_error} = require('../../../../../../utils/logger');

exports.main = async (req, res, next)  => {
  const cod_empresa = req.body.cod_empresa;
  const {valor}     = req.body;
  try {
		var sql =   ` select c.cod_condicion_venta,
												 c.descripcion desc_condicion_venta
										from cc_condiciones_ventas c 
									 where c.cod_empresa = :cod_empresa
										 and ( c.cod_condicion_venta like '%'||:valor||'%' or upper( c.descripcion ) like '%'||upper(:valor)||'%' or :valor = 'null')  
									 order by lpad(c.cod_condicion_venta,10,'0') asc
								`;
		var data = {cod_empresa,valor};  
		const response = await db.Open(sql,data,true,req.headers.authuser,await crypto.decrypt(req.headers.authpass));
		res.status(200).json(response);
	} catch (e) {
		log_error.error(`getCondicionVenta | vtfactur ${e}`)
		console.log(e);
		next();
	}
}