const oracledb                  = require("oracledb");
const db                        = require("../../../../../../../connection/conn"              );
const crypto                    = require("../../../../../../../utils/crypto"                 );
const { log_error}              = require('../../../../../../../utils/logger'                 );
const tableData                 = require('./tableDate');
const { generate_update }       = require('../../../../../../../utility/generate_update');
const { generate_insert }       = require('../../../../../../../utility/generate_insert');
const { generate_delete }       = require('../../../../../../../utility/generate_delete');
const {validateBooleanFunction} = require('../../../../../../../utils/validate'         );

exports.getNroComp = async (req, res, next) => {
  let { cod_empresa, tip_comprobante, ser_comprobante}     = req.params;
  try {
    var sql = ` select nvl( max(to_number(c.nro_comprobante) ) , 0 ) + 1 id
                  from vt_comprobantes_cabecera c 
                 where c.cod_empresa     =:cod_empresa
                   and c.tip_comprobante =:tip_comprobante
                   and c.ser_comprobante =:ser_comprobante`;
    var data = {cod_empresa,tip_comprobante,ser_comprobante};
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
                   from vt_comprobantes_detalle c 
                  where c.cod_empresa     = :cod_empresa
                    and c.tip_comprobante = :tip_comprobante
                    and c.ser_comprobante = :ser_comprobante
                    and c.nro_comprobante = :nro_comprobante`;
    var data = {cod_empresa,tip_comprobante,ser_comprobante,nro_comprobante};
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
  var cod_usuario  = content.auditoria.cod_usuario;
  var cod_empresa  = content.auditoria.cod_empresa;
  var v_band       = false;

  //  VALIDA CAB
  let VALIDA_CAB = [
    {
      campo			 : 'COD_EMPRESA'      ,
      paquete		 : 'EDS_CCNCRDEF.'    ,
      funcion		 : 'VALIDA_COMPROBANTE_REF',
      in_params  : ['COD_EMPRESA','TIP_COMPROBANTE_REF','SER_COMPROBANTE_REF','NRO_COMPROBANTE_REF'],
      out_params : [],
    },
     {
      campo			 : 'COD_CLIENTE'   ,
      paquete		 : 'EDS_CCNCRDEF.' ,
      funcion		 : 'VALIDA_CLIENTE',			
      in_params  : ['COD_EMPRESA'  , 'COD_CLIENTE','FEC_COMPROBANTE','CLIENTE_OCA'],
      out_params : [ 'DESC_CLIENTE'
                 , 'CLIENTE_PERSONA'
                 , 'RUC'
                 , 'TEL_CLIENTE'
                 , 'COD_CONDICION_VENTA' 
                 , 'DIAS_INICIAL'
                 , 'LIMITE_CREDITO'
                 , 'SIGLAS'
                 , 'SALDOS'
                 , 'COD_ZONA'
                 , 'IND_SUBCLI'
                 , 'COD_SUBCLIENTE'
                 , 'NOM_SUBCLIENTE'
                 , 'DIR_CLIENTE'
                 , 'CI'],
    },
    {
      campo			 : 'COD_CLIENTE'      ,
      paquete		 : 'EDS_CCNCRDEF.'    ,
      funcion		 : 'VALIDA_SUBCLIENTE',			
      in_params  : ['COD_EMPRESA'     , 'COD_CLIENTE', 'COD_SUBCLIENTE', 'IND_SUBCLI', 'CLIENTE_OCA'],
      out_params : ['NOM_SUBCLIENTE'  , 'DIR_CLIENTE', 'COD_ZONA']
    },
    {
      campo			 : 'COD_EMPRESA'      ,
      paquete		 : 'EDS_CCNCRDEF.'    ,
      funcion		 : 'VALIDA_COND_VENTA',
      in_params  : ['COD_EMPRESA'     , 'COD_CONDICION_VENTA', 'TIP_COMPROBANTE_REF'],
      out_params : ['DESC_CONDICION'  , 'DIAS_INICIAL','TIPO'],
    },
    {
      campo			 : 'COD_EMPRESA'      ,
      paquete		 : 'EDS_CCNCRDEF.'    ,
      funcion		 : 'VALIDA_MOTIVO_NCR',
      in_params  : ['COD_EMPRESA'     , 'COD_MOTIVO_NCR'],
      out_params : ['DESC_MOTIVO_NCR' , 'AFECT_STOCK','CARGA_REF'],
    },
    {
      campo			 : 'COD_EMPRESA'        ,
      paquete		 : 'EDS_CCNCRDEF.'      ,
      funcion		 : 'VALIDA_LISTA_PRECIO',
      in_params  : ['COD_EMPRESA'       , 'COD_LISTA_PRECIO'],
      out_params : ['DESC_LISTA_PRECIO'],
    },
    {
      campo			 : 'COD_SUCURSAL' ,
      paquete		 : 'EDS_CCNCRDEF.',
      funcion		 : 'VALIDA_ZONA'  ,			
      in_params  : ['COD_EMPRESA' ,'COD_CLIENTE', 'COD_SUBCLIENTE', 'COD_ZONA', 'CLIENTE_OCA'],
      out_params : ['DESC_ZONA']  ,
    },
    {
      campo			 : 'COD_EMPRESA'      ,
      paquete		 : 'EDS_CCNCRDEF.'    ,
      funcion		 : 'VALIDA_DESC_VENDEDOR',
      in_params  : ['COD_EMPRESA', 'COD_VENDEDOR', 'VENDEDOR_PERSONA'],
      out_params : ['DESC_VENDEDOR'],
    },
    {
      campo			 : 'COD_MONEDA'   ,
      paquete		 : 'EDS_CCNCRDEF.',
      funcion		 : 'VALIDA_MONEDA',
      in_params  : ['COD_MONEDA'] ,
      out_params : ['DESC_MONEDA' ,'DECIMALES', 'TIP_CAMBIO'],
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
    campo			 : 'COD_EMPRESA'        ,
    paquete		 : 'EDS_CCNCRDEF.'      ,
    funcion		 : 'UP_VALIDA_ARTICULO' ,
    in_params  : ['COD_EMPRESA'      , 'COD_SUCURSAL'   , 'COD_ARTICULO', 'CARGA_DETALLE'
                , 'PRECIO_VENTA'     , 'COD_MONEDA'     , 'IND_VENTA'   , 'COD_CONDICION_VENTA'
                , 'COD_LISTA_PRECIO' , 'IND_REG_TURISMO', 'CANTIDAD'    , 'COD_UNIDAD_MEDIDA'],
    out_params : ['DESC_ARTICULO'        , 'COD_IVA'
                 ,'PORC_IVA'             , 'PORC_GRAVADA' , 'COSTO_PROM'
                 ,'COSTO_ULTIMO'         , 'MULT'         , 'DIV'
                 ,'NRO_LOTE'             , 'IND_MANEJA_STOCK'
                 ,'PRECIO_UNITARIO_C_IVA', 'PRECIO_UB'    , 'PRECIO_VEN'
                 ,'PRECIO_MIN'           , 'PREC_MIN_PERM', 'PORC_COM'
                 ,'PORC_VTA'             , 'TIP_PROD'     , 'PORC_NEG'
                 ,'PRECIO_NEG'           , 'FEC_VIGENCIA'],
    bind_type  : { COD_UNIDAD_MEDIDA :'INOUT' },
    in_type    : { CANTIDAD          :'NUMBER'
                 , PRECIO_VENTA      :'NUMBER'
                 },
    out_type:{ COD_IVA                : 'NUMBER',
               PORC_COM               : 'NUMBER',
               PORC_GRAVADA           : 'NUMBER',
               PORC_IVA               : 'NUMBER',
               PORC_NEG               : 'NUMBER',
               PORC_VTA               : 'NUMBER',
               PRECIO_MIN             : 'NUMBER',
               PRECIO_NEG             : 'NUMBER',
               PRECIO_UB              : 'NUMBER',
               PRECIO_UNITARIO_C_IVA  : 'NUMBER',
               PRECIO_VEN             : 'NUMBER',
               PREC_MIN_PERM          : 'NUMBER',
               MULT                   : 'NUMBER',
               DIV                    : 'NUMBER',
              }
   },
   {
		campo			: 'COD_EMPRESA',
		paquete		: 'EDS_VTPRESAR.',
		funcion		: 'VALIDA_UM',
		in_params	: ['COD_EMPRESA','COD_SUCURSAL','COD_ARTICULO','COD_UNIDAD_MEDIDA','DECIMALES','CANTIDAD','DESCUENTO','COD_LISTA_PRECIO','PORC_IVA','PORC_GRAVADA'],
		out_params: ['DESC_UNIDAD_MEDIDA'
                ,'PRECIO_UNITARIO'
                ,'PRECIO_UNITARIO_C_IVA'
                ,'MONTO_TOTAL'
                ,'MONTO_TOTAL_CONIVA'
                ,'TOTAL_IVA'
                ,'PORC_DESC'
                ,'CANTIDAD_UB'
                ,'MULT'
                ,'DIV'],
    in_type   : { CANTIDAD          :'NUMBER' 
                , DESCUENTO         :'NUMBER'
                , MONTO_TOTAL_C_IVA :'NUMBER'
                , PORC_IVA          :'NUMBER'
                , PORC_GRAVADA      :'NUMBER'
              },
    out_type:{
      PRECIO_UNITARIO       : 'NUMBER',
      PRECIO_UNITARIO_C_IVA : 'NUMBER',
      MONTO_TOTAL           : 'NUMBER',
      MONTO_TOTAL_CONIVA    : 'NUMBER',
      TOTAL_IVA             : 'NUMBER',
      MULT                  : 'NUMBER',
      DIV                   : 'NUMBER',
      PORC_DESC             : 'NUMBER',
      CANTIDAD_UB           : 'NUMBER',      
    },    
  },
  {
    campo			 : 'COD_EMPRESA'  ,
    paquete		 : 'EDS_CCNCRDEF.',
    funcion		 : 'VALIDA_UM'    ,
    in_params  : ['COD_EMPRESA' , 'COD_ARTICULO' , 'COD_UNIDAD_MEDIDA', 'PRECIO_UB'   , 'DECIMALES']   ,
    out_params : ['DESC_UNIDAD_MEDIDA', 'MULT'   , 'DIV', 'PRECIO_UNITARIO_C_IVA'],
    in_type    : { DECIMALES             :'NUMBER'},
    out_type   : { PRECIO_UNITARIO_C_IVA :'NUMBER'}
   }
  ]

  if(content.delete_cab === 0){
    var result = await validateBooleanFunction(content.updateInserDataDet, VALIDA_DET, req)
    if(result.valor){
      v_mensaje = {'ret': 0,'p_mensaje':result.p_mensaje}
      v_band    = true
    }
  }

  // // ||============================================= RETORNA, SI HAY VALIDA QUE NO CORRESPONDA   ============================== ||
  if(v_band){
   res.json(v_mensaje);
   return
  }

  // CAB
  let NameTableCab   = 'VT_COMPROBANTES_CABECERA';
	let tableCab       = tableData.find( item => item.table === NameTableCab);
  let datosInserCab  = await generate_insert(NameTableCab, content.updateInserData, {COD_EMPRESA:cod_empresa,FEC_ALTA:'sysdate',COD_USUARIO:`'${cod_usuario}'`},tableCab.column);
  let datosUpdatCab  = await generate_update(NameTableCab, content.updateInserData, content.aux_updateInserData,{FEC_ESTADO:'sysdate'},{FEC_ESTADO:'sysdate',COD_USUARIO_MODI:`'${cod_usuario}'`}, tableCab.column,  tableCab.pk);
  let deleteCab      = await generate_delete(NameTableCab, content.delete_cab,{ cod_empresa, cod_usuario, direccion_ip, modulo:'ST', paquete:'eds_ccncrdef' }, tableCab.column,  tableCab.pk); 

  // DET
  let NameTableDet   = 'VT_COMPROBANTES_DETALLE';
	let tableDet       = tableData.find( item => item.table === NameTableDet);
  let datosInserDet  = await generate_insert(NameTableDet, content.updateInserDataDet, {COD_EMPRESA:cod_empresa},tableDet.column);
  let datosUpdatDet  = await generate_update(NameTableDet, content.updateInserDataDet, content.aux_updateInserDataDet,{},{}, tableDet.column,  tableDet.pk);
  let deleteDet      = await generate_delete(NameTableDet, content.delete_Det,{ cod_empresa, cod_usuario, direccion_ip, modulo:'ST', paquete:'eds_ccncrdef' }, tableDet.column,  tableDet.pk); 

  try {
  var sql =   `
          BEGIN
              :ret := eds_ccncrdef.abm_ccncrdef ( -- CAB
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
    res.status(200).json(result.outBinds ? result.outBinds : {p_mensaje:result.message});
  } catch (error) {
    next();
    log_error.error(` ${error}`)
    log_error.error(`abm_ccncrdef resul : ${result}`)
    console.log("Error metodo abm_ccncrdef",error);
    res.status(200).json({error})
  }
}