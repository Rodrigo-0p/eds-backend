const db          = require("../../../../../../connection/conn");
const crypto      = require("../../../../../../utils/crypto");
const {log_error} = require('../../../../../../utils/logger');

exports.main = async (req, res, next)  => {
  const cod_empresa = req.body.cod_empresa;
  const {valor}     = req.body;
  try {
		var sql =   ` select c.cod_cliente,
													p.nombre nom_cliente
										from cc_clientes c, personas p
										where c.cod_persona = p.cod_persona
											and c.cod_empresa = :cod_empresa
											and ( c.cod_cliente like '%'||:valor||'%' or 
										upper( p.nombre ) like '%'||upper(:valor)||'%' or :valor = 'null')
											and nvl(estado,'I') = 'A'
											and rownum <= 100
										order by lpad(c.cod_cliente,10,'0') asc
								`;
		var data = {cod_empresa,valor};
		const response = await db.Open(sql,data,true,req.headers.authuser,await crypto.decrypt(req.headers.authpass));
		res.status(200).json(response);
	} catch (e) {
		log_error.error(`getCliente | vtfactur ${e}`)
		console.log(e);
		next();
	}
}