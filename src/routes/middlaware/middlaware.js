const jwt         = require('jsonwebtoken');
const {log_error} = require('../../utils/logger')

const verificarToken = (req, res, next)=>{
  const token = req.headers.authorization;
  if(!token) return res.status(401).json({error:true, message:"Acceso denegado",data:{rows:[]}})
  try {
      const verifar = jwt.verify(token,process.env.JW_CLAVE)
      req.dataToken = verifar;
      next();
  } catch (error) {
    let ip           = req.headers['cf-connecting-ip'] || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    let direccion_ip = ip.replace("::ffff:","");
    log_error.error(`verificarToken: IP:${direccion_ip} - Date:${new Date} - Token no valido:${token}`)
    res.status(401).json({error:true, message:'Acceso denegado. Token invalido',data:{rows:[]}});
  }
}
module.exports = verificarToken;

