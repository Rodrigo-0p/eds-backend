const express        = require('express');
const useragent      = require('express-useragent');

const morgan         = require('morgan');
const routes         = require('./routes/routesIndex');
const cors           = require('cors');
const app            = express();
const jwt            = require("jsonwebtoken");
const moment         = require('moment');
// const {logger,logger_error} = require('./utils/logger')

require('dotenv').config();
app.use(useragent.express());
app.use(morgan('tiny',{ stream: { 
                                //   write: (message) => logger.info(message.trim()),                                  
                                },
                      }
              )
        );
app.use(express.json({limit: '5120mb'}));
app.use(express.urlencoded({limit: '5120mb', extended: true}));
// CORS
app.use(cors());

app.use(function (req, res, next) {
    // Allow Origins
    res.header("Access-Control-Allow-Origin", "*");
    // Allow Methods
    res.header("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");
    // Allow Headers
    res.header("Access-Control-Allow-Headers", "Origin, Accept, Content-Type, Authorization");
    // Handle preflight, it must return 200
    if (req.method === "OPTIONS") {
      // Stop the middleware chain
      return res.status(200).end();
    }
    
    if ( req.path == '/api/auth/login') {
      return next()
    }

    // Next middleware
    next();
});
// app.use((req, res, next) => {
//     // login does not require jwt verification
    
//     if ( req.path == '/api/auth/login' || 
//          req.path.slice(0,7)  == '/public' || 
//          req.path == '/st/stmarart/prueba' || 
//          req.path == '/vt/vtdocfac/evento' || 
//          req.path == '/vt/vtdocfac/planilla' // DE por planilla
//          ) {
//       // next middleware
//       return next()
//     }
//     // get token from request header Authorization
//     // Token verification
//     const token = req.headers.authorization
//     // Debug print
//     console.log("Authorization:", token)
//     console.log(req.path)
//     const ip         = req.headers['cf-connecting-ip'] || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
//     var direccion_ip = ip.replace("::ffff:","");
//     logger.info(`ruta: ${req.path} - ${direccion_ip} - [${moment().format('DD-MM-YYYY HH:mm')}]`)
    
//     try {
//       jwt.verify(token,'apolo'); //jwtSecret
//     } catch (err) {
//       logger_error.error(`token:${err.message}`)
//       return res.status(401).json({ "message": err.message });
//     }
    
//     next()

// });
// app.use('/public', express.static(process.env.FILESTORE));


// ROUTES
app.use('/', routes());
module.exports = app;