const db             = require("../../../../../../connection/conn");
const crypto         = require("../../../../../../utils/crypto");
const {logger_error} = require('../../../../../../utils/logger')

exports.main = async (req, res, next)=>{
  var value       = req.body.value;
  var cod_empresa = req.body.cod_empresa;
  
  var valueArray = [];
  if(value !== 'null' ){
    valueArray = value.split(' ');
    value = '%' + value.replace(' ', '%') + '%';
  }
  try {
      var query = '';
      query += ` select *
                   from eds_vcm_datos_proveedores p
              `;
              if(value != 'null'){
                  var filter = req.body.filter;
                  for (var i = 0; i < filter.length; i++) {
                      var item = filter[i];
                      if(i == 0){
                          query += ` where p.cod_empresa = :cod_empresa and \n(`;
                      }else{
                          query += ` or `;
                      }
                      query += ` ( `;
                      for (let index = 0; index < valueArray.length; index++) {
                          var element = valueArray[index];
                          element = element.toUpperCase();
                          query += ` upper(p.${item}) like '%${element}%' `;
                          if(index < valueArray.length -1){
                              query += ` and `;
                          }
                          if(index == valueArray.length -1){
                              query += ` or :value = 'null' `;
                          }
                      }
                      query += ` ) \n`;
                  }
                  query += `\n ) and rownum <= 20 \n`;
              }else{
                  query += `where p.cod_empresa = :cod_empresa 
                              and :value = 'null' \n`;
                  query += `order by lpad(p.cod_proveedor,10,'0') desc`
              }
      var data = {cod_empresa, value};    
      const response = await db.Open(query, data,true, req.headers.authuser, await crypto.decrypt(req.headers.authpass) );
      res.status(200).json(response);
  } catch (error) {
      console.log(error);
      next();
  }    
}