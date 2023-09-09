const jwt   = require('jsonwebtoken');

const verificarToken = (req, res, next)=>{
const token = req.header('auth-token');
  if(!token) return res.status(200).json({error:true, message:"Acceso denegado"})
  try {
      const verifar = jwt.verify(token,process.env.JW_CLAVE)
      req.dataToken = verifar;
      next();
  } catch (error) {
      console.log('verificarToken: Token no valido')
      res.status(200).json({error:true, message:'Acceso denegado. Token invalido'});
  }
}
module.exports = verificarToken;