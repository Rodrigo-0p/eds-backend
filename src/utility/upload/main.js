const multer    = require('multer');
const fs        = require('fs');
const logger    = require('../../utils/logger')
require('dotenv').config();
const filestore = process.env.FILESTORE_IMG

const storage  = multer.diskStorage({    
  destination: (req, file, cb) => {
      var dirr = process.env.FILESTORE_IMG+req.params.cod_empresa;
      
      console.log('ruta img',dirr);

      if(!fs.existsSync(dirr)) {
          fs.mkdir(dirr,function(err){
              if (err) {
                  return console.error(err);
              }
              // req.status(200).json([{"mensaje":"OK"}]);
          });
      }
      cb(null,dirr);
  },
  filename: (req, file, cb) => {
    cb(null, req.params.nameImg);
  }  
});

const uploadImage = multer({
  storage,
  limits: {fileSize: 10000000000000}
}).single('image');

exports.main =  async (req, res, next) => {
  try {
    uploadImage(req, res, function(err) {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      // Si la carga de la imagen es exitosa, puedes acceder al archivo en req.file
      // Aquí puedes agregar la lógica adicional para manejar la imagen cargada, por ejemplo, guardar su ruta en una base de datos, etc.
      const imagePath = filestore+'\\'+req.params.cod_empresa
      // Aquí puedes hacer lo que quieras con la imagen cargada, como guardar la ruta en una base de datos, etc.
      res.status(200).json({ mensaje: "Imagen cargada exitosamente", imagePath });
    });  
  } catch (error) {
    logger.log_error(error)
    res.status(400).json({res:0, mensaje:`La img no se ha guardado!!`});
  }
  
}