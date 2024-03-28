const oracledb                  = require("oracledb");
const db                        = require("../../../../../connection/conn"          );
const crypto                    = require("../../../../../utils/crypto"             );
const { log_error}              = require('../../../../../utils/logger'             );
const tableData                 = require('./tableDate');
const { generate_update }       = require('../../../../../utility/generate_update'  );
const { generate_insert }       = require('../../../../../utility/generate_insert'  );
const { generate_delete }       = require('../../../../../utility/generate_delete'  );
const {validateBooleanFunction,
       validateGlobalFunction } = require('../../../../../utils/validate'           );

exports.getNroComp = async (req, res, next) => {
  let { cod_empresa, tip_comprobante, ser_comprobante}     = req.params;
  try {
    var sql = ` select nvl( max(to_number(c.nro_comprobante) ) , 0 ) + 1 id
                  from cm_compras_cabecera c 
                 where c.cod_empresa     =:cod_empresa
                   and c.tip_comprobante =:tip_comprobante
                   and c.ser_comprobante =:ser_comprobante`;
    var data = [cod_empresa,tip_comprobante,ser_comprobante];
    const response = await db.Open(sql,data,true,req.headers.authuser,await crypto.decrypt(req.headers.authpass));
    res.status(200).json(response);
  } catch (error) {
    log_error.error(`getNroComprobante ${error}`)
    console.log(error);
    next();
  }
}
exports.getNrOrden = async (req, res, next) => {
  let { cod_empresa, tip_comprobante, ser_comprobante, nro_comprobante}     = req.params;  
  try {
    var sql = `  select nvl( max(to_number(c.nro_orden) ) , 0 ) + 1 id
                   from cm_compras_detalle c 
                  where c.cod_empresa = :cod_empresa
                    and c.tip_comprobante = :tip_comprobante
                    and c.ser_comprobante = :ser_comprobante
                    and c.nro_comprobante = :nro_comprobante`;
    var data = [cod_empresa,tip_comprobante,ser_comprobante,nro_comprobante];
    const response = await db.Open(sql,data,true,req.headers.authuser,await crypto.decrypt(req.headers.authpass));
    res.status(200).json(response);
  } catch (error) {
    log_error.error(`getNroOrden ${error}`)
    console.log(error);
    next();
  }
}
exports.main = async(req, res, next)=>{
  var content      = req.body;
  const ip         = req.headers['cf-connecting-ip'] || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  var direccion_ip = ip.replace("::ffff:","");
  var cod_usuario  = content.AditionalData[0].cod_usuario;
  var cod_empresa  = content.AditionalData[0].cod_empresa;
  var v_band       = false;

  //  VALIDA CAB
  var VALIDA_CAB = [
    {
      campo			 : 'COD_SUCURSAL'   ,
      paquete		 : 'EDS_CMFACTUR.'  ,
      funcion		 : 'VALIDA_SUCURSAL',			
      in_params  : ['COD_EMPRESA','COD_SUCURSAL'],
      out_params : ['DESC_SUCURSAL','IND_TIMBRADO','AFECTA_COSTO'],
    },{
      campo			: 'FEC_COMPROBANTE',
      paquete		: 'EDS_CMFACTUR.',
      funcion		: 'VALIDA_FECHA_COMPROBANTE',
      in_params	: ['FEC_COMPROBANTE'],
      out_params: [],    
      bind_type : {'FEC_COMPROBANTE':'INOUT'},
      out_type  : {FEC_COMPROBANTE:'SYSDATE'},  
    },{
      campo			: 'COD_PROVEEDOR',
      paquete		: 'EDS_CMFACTUR.',
      funcion		: 'VALIDA_PROVEEDOR',
      in_params	: ['COD_EMPRESA','COD_PROVEEDOR'],
      out_params: [ 'DESC_PROVEEDOR'
                  , 'EXENTO'
                  , 'COD_CONDICION_COMPRA'
                  , 'COD_CONDICION_COMPRA_ANT'
                  , 'DESC_CONDICION'
                  , 'COD_MONEDA'
                  , 'DESC_MONEDA'
                  , 'DECIMALES'
                  , 'TIP_CAMBIO'
                  , 'NRO_TIMBRADO'
                  , 'IND_DIF_PRECIO'
                  , 'IND_ODC'
                  ]
    }
  ]
  if(content.exitInsertedBand){
    var result = await validateBooleanFunction(content.updateInserData, VALIDA_CAB, req)
    if(result.valor){
      v_mensaje = {'ret': 0,'p_mensaje':result.p_mensaje}
      v_band    = true
    }
  }
  //  VALIDA DETALLE
  var VALIDA_DET = [{
		campo			: 'COD_EMPRESA',
		paquete		: 'EDS_CMFACTUR.',
		funcion		: 'VALIDA_ARTICULO',
		in_params	: ['COD_EMPRESA','COD_SUCURSAL','COD_ARTICULO','COD_PROVEEDOR','COD_MONEDA','DECIMALES'],
		out_params: ['DESC_ARTICULO' 				,'IND_MANEJA_EXISTENCIA'  ,'COD_ORIGEN_ART'     , 
                'COD_IVA'								,'PORCENTAJE_IVA'					,'COD_UNIDAD_MEDIDA'  , 
                'DESC_UNIDAD_MEDIDA'		,'NRO_LOTE'								,'FEC_VENCIMIENTO'    , 
                'MISMOPROV'							,'MULT'										,'DIV'                , 
                'IND_BASICO'						,'PRECIO_COM'							,'PRECIO_COM_UB'      , 
                'UNIDAD_MED_COSTO'			,'PRECIO_UNITARIO_C_IVA'	,'PRECIO_ULTIMO_COSTO'],
    in_type:{
      DECIMALES: 'NUMBER',
    },
    out_type:{
      PORCENTAJE_IVA       : 'NUMBER',
      MULT                 : 'NUMBER',
      DIV                  : 'NUMBER',
      PRECIO_COM           : 'NUMBER',
      PRECIO_COM_UB        : 'NUMBER',
      PRECIO_UNITARIO_C_IVA: 'NUMBER',
      PRECIO_ULTIMO_COSTO  : 'NUMBER'
    }
  },{
    campo			: 'COD_EMPRESA',
    paquete		: 'EDS_CMFACTUR.',
    funcion		: 'VALIDA_UM',
    in_params	: ['COD_EMPRESA','COD_ARTICULO','COD_UNIDAD_MEDIDA','COD_SUCURSAL','COD_MONEDA','DECIMALES'],
    out_params: [ 'DESC_UNIDAD_MEDIDA'
                , 'MULT'
                , 'DIV'
                , 'IND_BASICO'
                , 'PRECIO_COM'
                , 'PRECIO_COM_UB'
                , 'UNIDAD_MED_COSTO'
                , 'PRECIO_UNITARIO_C_IVA'
                , 'PRECIO_ULTIMO_COSTO'
              ],
    out_type:{
      MULT                 : 'NUMBER',
      DIV                  : 'NUMBER',
      PRECIO_COM           : 'NUMBER',
      PRECIO_COM_UB        : 'NUMBER',
      PRECIO_UNITARIO_C_IVA: 'NUMBER',
      PRECIO_ULTIMO_COSTO  : 'NUMBER'
    }
  }]
  if(content.exitInsertedBand){
    var result = await validateBooleanFunction(content.updateInserDataDet, VALIDA_DET, req)
    if(result.valor){
      v_mensaje = {'ret': 0,'p_mensaje':result.p_mensaje}
      v_band    = true
    }
  }
  // ||============================================= RETORNA, SI HAY VALIDA QUE NO CORRESPONDA   ============================== ||
  if(v_band){
   res.json(v_mensaje);
   return
  }

  // CAB
  let NameTableCab   = 'CM_COMPRAS_CABECERA';
	let tableCab       = tableData.find( item => item.table === NameTableCab);
  let datosInserCab  = await generate_insert(NameTableCab, content.updateInserData, {COD_EMPRESA:cod_empresa,FEC_ALTA:'sysdate',COD_USUARIO:`'${cod_usuario}'`},tableCab.column);
  let datosUpdatCab  = await generate_update(NameTableCab, content.updateInserData, content.aux_updateInserData,{},{}, tableCab.column,  tableCab.pk);
  let deleteCab      = await generate_delete(NameTableCab, content.delete_cab,{ cod_empresa, cod_usuario, direccion_ip, modulo:'CM', paquete:'eds_cmfactur' }, tableCab.column,  tableCab.pk); 

  // DET
  let NameTableDet   = 'CM_COMPRAS_DETALLE';
	let tableDet       = tableData.find( item => item.table === NameTableDet);
  let datosInserDet  = await generate_insert(NameTableDet, content.updateInserDataDet, {COD_EMPRESA:cod_empresa},tableDet.column);
  let datosUpdatDet  = await generate_update(NameTableDet, content.updateInserDataDet, content.aux_updateInserDataDet,{},{}, tableDet.column,  tableDet.pk);
  let deleteDet      = await generate_delete(NameTableDet, content.delete_Det,{ cod_empresa, cod_usuario, direccion_ip, modulo:'CM', paquete:'eds_cmfactur' }, tableDet.column,  tableDet.pk); 

  try {
  var sql =   `
          BEGIN
              :ret := eds_cmfactur.abm_cmfactur ( -- CAB
                                                :p_delete_cab  ,
                                                :p_update_cab  ,
                                                :p_insert_cab  ,
                                                -- DET
                                                :p_delete_det  ,
                                                :p_update_det  ,
                                                :p_insert_det  ,
                                                --
                                                :p_mensaje
                                              );
          END;`;
      const result  = await db.Open(sql,{
        // --- CAB 
        p_delete_cab  : deleteCab    ,
        p_update_cab  : datosUpdatCab,
        p_insert_cab  : datosInserCab,
        // --- DET 
        p_delete_det  : deleteDet    ,
        p_update_det  : datosUpdatDet,
        p_insert_det  : datosInserDet,

        p_mensaje          : { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 300 },
        ret                : { dir: oracledb.BIND_OUT, type: oracledb.NUMBER, maxSize: 300 },
      }, true, req.headers.authuser, await crypto.decrypt(req.headers.authpass) );

      if(content.updateInserData.length > 0 && result.outBinds && result.outBinds.ret === 1){
        let valor  = content.updateInserData[0];

        if ( ( valor.BLOQ_X_PREC  === 'N'  )  || 
             ( valor.BLOQ_X_COND  === 'N'  )  || 
             ( valor.BLOQ_X_FLETE === 'N'  )  || 
             ( valor.BLOQ_X_OTROS === 'N'  )  &&  ( valor.ESTADO  !== 'A'  ) ){
        
            let params = [{
                COD_EMPRESA       : valor.COD_EMPRESA      ,      
                COD_SUCURSAL      : valor.COD_SUCURSAL     ,
                FEC_COMPROBANTE   : valor.FEC_COMPROBANTE  ,
                TIP_COMPROBANTE   : valor.TIP_COMPROBANTE  ,
                SER_COMPROBANTE   : valor.SER_COMPROBANTE  ,
                NRO_COMPROBANTE   : valor.NRO_COMPROBANTE  ,
                BLOQ_X_PREC       : valor.BLOQ_X_PREC      ,
                BLOQ_X_COND       : valor.BLOQ_X_COND      ,
                BLOQ_X_FLETE      : valor.BLOQ_X_FLETE     ,
                BLOQ_X_OTROS      : valor.BLOQ_X_OTROS     ,
                BLOQ_X_SUP        : valor.BLOQ_X_SUP ? valor.BLOQ_X_SUP : 'N',
                COD_PROVEEDOR     : valor.COD_PROVEEDOR    ,
                TOT_COMPROBANTE   : valor.TOT_COMPROBANTE  ,
            }];

            console.log(params);

            const INSERT_AUTORIZACION_COMPRA = [{
                campo: 'NRO_COMPROBANTE',
                funcion: 'ACT_AUTORIZA_COMPRA',
                in_params: [
                  'COD_EMPRESA'       , 'COD_SUCURSAL' ,'FEC_COMPROBANTE' , 'TIP_COMPROBANTE' ,'SER_COMPROBANTE',
                  'NRO_COMPROBANTE'   , 'BLOQ_X_PREC'  ,'BLOQ_X_COND'     , 'BLOQ_X_FLETE'    ,
                  'BLOQ_X_OTROS'      , 'BLOQ_X_SUP'   ,'COD_PROVEEDOR'   , 'TOT_COMPROBANTE' 
                ],
                out_params:[],
                type:[]
              },
            ];
            var resultado = await validateGlobalFunction(params, INSERT_AUTORIZACION_COMPRA, req)          
            if(!resultado.valor) result.outBinds.p_mensaje = 'Se generará una autorización para este Pedido';
            else{
              result.outBinds.ret       = 0 
              result.outBinds.p_mensaje = resultado?.data?.outBinds?.p_mensaje;
            }  

        }else{
          if (valor.ESTADO !== 'A' ){

            let NameTable           = 'CM_AUTORIZA_COMPRA';
            let table               = tableData.find( item => item.table === NameTable);
            let p_delete_aut_compra = await generate_delete(NameTable, [valor],{ cod_empresa, cod_usuario, direccion_ip, modulo:'CM', paquete:'eds_cmfactur' }, table.column,  table.pk); 
            try {
              var sql =   `
                  BEGIN
                      :ret := eds_cmfactur.delete_aut_compra (  :p_delete_autoriza_compra,
                                                                :p_mensaje
                                                              );
                  END;`;
              const resp  = await db.Open(sql,{
                p_delete_autoriza_compra     : p_delete_aut_compra,      
                p_mensaje                    : { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 300 },
                ret                          : { dir: oracledb.BIND_OUT, type: oracledb.NUMBER, maxSize: 300 },
              }, true, req.headers.authuser, await crypto.decrypt(req.headers.authpass) );

              if(!resp.valor) result.outBinds.p_mensaje = '';
              else{
                result.outBinds.ret       = 0 
                result.outBinds.p_mensaje = resp?.data?.outBinds?.p_mensaje;
              }
            } catch (error) {
              console.error(error)
              log_error.error(`abm_cmfactur ${error}`)
            }

          }
        }
      }

    res.status(200).json(result.outBinds ? result.outBinds : {p_mensaje:result.message});
  } catch (error) {
    next();
    log_error.error(` ${error}`)
    log_error.error(`abm_cmfactur resul : ${result}`)
    console.log("Error metodo eds_cmfactur",error);
    res.status(200).json({error})
  }
}