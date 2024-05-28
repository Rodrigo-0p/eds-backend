const db          = require("../../../../../../connection/conn");
const crypto      = require("../../../../../../utils/crypto");
const {log_error} = require('../../../../../../utils/logger');

exports.main = async (req, res, next)  => {
  const cod_empresa = req.body.cod_empresa;
	const cod_cliente = req.body.cod_cliente;
  const {valor}     = req.body;
  try {
      var sql =   ` select s.cod_subcliente,
                           s.descripcion nom_subcliente
                      from cc_subclientes s, cc_clientes c
                     where s.cod_empresa = c.cod_empresa
										   adn s.cod_cliente = s.cod_cliente
					             and c.cod_empresa = :cod_empresa
											 and c.cod_cliente = :cod_cliente
                       and ( c.cod_subcliente like '%'||:valor||'%' or upper( c.descripcion ) like '%'||upper(:valor)||'%' or :valor = 'null')
                       and nvl(estado,'I') = 'A'
                       and rownum <= 100
                     order by lpad(c.cod_subcliente,10,'0') asc
                  `;
      var data = {cod_empresa,cod_cliente,valor};
      const response = await db.Open(sql,data,true,req.headers.authuser,await crypto.decrypt(req.headers.authpass));
      res.status(200).json(response);
    } catch (e) {
      log_error.error(`getSubCliente | vtfactur ${e}`)
      console.log(e);
      next();
    }
  }