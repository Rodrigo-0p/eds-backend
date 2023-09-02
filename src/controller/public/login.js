const conn                   = require('../../connection/conn');
const crypto                 = require('../../utils/crypto');
const {log_info
     , log_error}            = require('../../utils/logger')
const jwt                    = require("jsonwebtoken");
const moment                 = require('moment');
const _                      = require('underscore')
const { permisos_menu      } = require('../public/privilegios/permisos');
const { PermisosdeGrupo    } = require('../public/privilegios/PermisosdeGrupo');
const { PermisosEspeciales } = require('../public/privilegios/PermisosEspeciales');

exports.AutenticarUsuario = async (req, res, next) => {

     let username = req.query.in_username;
     let password = req.query.in_password;

     try {
          username         = username.toUpperCase();
          let cryptPassword = await crypto.encrypt(password);     
          
     sql = `   
          select p.nombre
               , u.cod_usuario
               , u.cod_persona
               , u.cod_grupo
               , u.cod_empresa
               , u.estado
               , e.ruta_logo
               , e.descripcion desc_empresa
               , s.cod_sucursal
               , s.descripcion desc_sucursal
               , '${cryptPassword}' cryptPass
          from bs_usuarios  u ,
               personas     p ,
               empresas     e ,
               sucursales   s
               where u.cod_persona   = p.cod_persona
               and u.cod_empresa     = e.cod_empresa
               and u.cod_empresa     = s.cod_empresa
               and u.cod_sucursal    = s.cod_sucursal
               and nvl(u.estado,'I') = 'A'
               and u.cod_usuario     =:cod_usuario`
          

     let response = await conn.Open(sql,{cod_usuario:username},false, username, password);

     if( response.errorNum > 0){
          response = response.toString();
          log_error.error(`${moment().format('DD/MM/YYYY HH:mm:ss')} \n User = ${username} \n Open = ${response.errorNum} \n sql= ${sql} ||` )
          res.status(401).send({ message: response });
          next();
          return;
      }
      var usuario = response.rows[0];
      if (_.isUndefined(usuario)) {
          await res.status(401).json({ message: "El Usuario no Existe" });
          next();
      }else{
          if (usuario.ESTADO == 'A') {
               const token = jwt.sign({
                    username: usuario.username,
                    },process.env.JW_CLAVE,{expiresIn: "5h",}
                );
               usuario.token = token;

              let menu     = await permisos_menu(username,password,next);
              let perGrupo = await PermisosdeGrupo(username,password,next);
              let perEspec = await PermisosEspeciales(username,password,next);
              
               usuario.menu      = menu;
               usuario.per_grupo = perGrupo;
               usuario.per_Espec = perEspec;

               res.json(usuario);

          } else {
               await res.status(401).json({ message: "Usuario Inactivo" });
               next();
          }
      }

     } catch (error) {
          log_error.error('Login'+error);
          console.log(error);
          next();
     }
}