module.exports = [
  {
    table: 'CM_COMPRAS_CABECERA',
    column: [ {"COLUMN_NAME":"COD_EMPRESA"            , "DATA_TYPE":"VARCHAR2"  }
            , {"COLUMN_NAME":"TIP_COMPROBANTE"        , "DATA_TYPE":"VARCHAR2"  }
            , {"COLUMN_NAME":"SER_COMPROBANTE"        , "DATA_TYPE":"VARCHAR2"  }
            , {"COLUMN_NAME":"NRO_COMPROBANTE"        , "DATA_TYPE":"NUMBER"    }
            , {"COLUMN_NAME":"COD_SUCURSAL"           , "DATA_TYPE":"VARCHAR2"  }
            , {"COLUMN_NAME":"FEC_COMPROBANTE"        , "DATA_TYPE":"DATE"      }
            , {"COLUMN_NAME":"COD_PROVEEDOR"          , "DATA_TYPE":"VARCHAR2"  }
            , {"COLUMN_NAME":"COD_CONDICION_COMPRA"   , "DATA_TYPE":"VARCHAR2"  }
            , {"COLUMN_NAME":"TIP_COMPROBANTE_REF"    , "DATA_TYPE":"VARCHAR2"  }
            , {"COLUMN_NAME":"SER_COMPROBANTE_REF"    , "DATA_TYPE":"VARCHAR2"  }
            , {"COLUMN_NAME":"NRO_COMPROBANTE_REF"    , "DATA_TYPE":"NUMBER"    }
            , {"COLUMN_NAME":"TOT_COMPROBANTE"        , "DATA_TYPE":"NUMBER"    }
            , {"COLUMN_NAME":"TOT_GRAVADAS"           , "DATA_TYPE":"NUMBER"    }
            , {"COLUMN_NAME":"TOT_EXENTAS"            , "DATA_TYPE":"NUMBER"    }
            , {"COLUMN_NAME":"TOT_IVA"                , "DATA_TYPE":"NUMBER"    }
            , {"COLUMN_NAME":"COD_MONEDA"             , "DATA_TYPE":"VARCHAR2"  }
            , {"COLUMN_NAME":"TIP_CAMBIO"             , "DATA_TYPE":"NUMBER"    }
            , {"COLUMN_NAME":"ESTADO"                 , "DATA_TYPE":"VARCHAR2"  }
            , {"COLUMN_NAME":"FEC_ESTADO"             , "DATA_TYPE":"DATE"      }
            , {"COLUMN_NAME":"COD_USUARIO"            , "DATA_TYPE":"VARCHAR2"  }
            , {"COLUMN_NAME":"FEC_ALTA"               , "DATA_TYPE":"DATE"      }
            , {"COLUMN_NAME":"REFERENCIA"             , "DATA_TYPE":"VARCHAR2"  }
            , {"COLUMN_NAME":"SER_REFERENCIA"         , "DATA_TYPE":"VARCHAR2"  }
            , {"COLUMN_NAME":"COD_LISTA_PRECIO"       , "DATA_TYPE":"VARCHAR2"  }
            , {"COLUMN_NAME":"ASIENTOS"               , "DATA_TYPE":"VARCHAR2"  }
            , {"COLUMN_NAME":"TIP_CAMBIO_US"          , "DATA_TYPE":"NUMBER"    }
            , {"COLUMN_NAME":"TIP_CAMBIO_RS"          , "DATA_TYPE":"NUMBER"    }
            , {"COLUMN_NAME":"IND_COMPRA_LOCAL"       , "DATA_TYPE":"VARCHAR2"  }
            , {"COLUMN_NAME":"IND_AJUSTE_STOCK"       , "DATA_TYPE":"VARCHAR2"  }
            , {"COLUMN_NAME":"COD_SUCURSAL_STK"       , "DATA_TYPE":"VARCHAR2"  }
            , {"COLUMN_NAME":"FEC_RECEPCION"          , "DATA_TYPE":"DATE"      }
            , {"COLUMN_NAME":"IND_IVA_INCLUIDO"       , "DATA_TYPE":"VARCHAR2"  }
            , {"COLUMN_NAME":"TIPO_USO"               , "DATA_TYPE":"VARCHAR2"  }
            , {"COLUMN_NAME":"COD_TIPO"               , "DATA_TYPE":"VARCHAR2"  }
            , {"COLUMN_NAME":"COD_CENTRO_COSTO"       , "DATA_TYPE":"VARCHAR2"  }
            , {"COLUMN_NAME":"NRO_COMPROBANTE_PROV"   , "DATA_TYPE":"NUMBER"    }
            , {"COLUMN_NAME":"IND_CAJA_CHICA"         , "DATA_TYPE":"VARCHAR2"  }
            , {"COLUMN_NAME":"IND_DIRECTO"            , "DATA_TYPE":"VARCHAR2"  }
            , {"COLUMN_NAME":"EXENTO"                 , "DATA_TYPE":"VARCHAR2"  }
            , {"COLUMN_NAME":"NRO_ASIENTO"            , "DATA_TYPE":"NUMBER"    }
            , {"COLUMN_NAME":"NRO_DESPACHO"           , "DATA_TYPE":"NUMBER"    }
            , {"COLUMN_NAME":"COD_VEHICULO"           , "DATA_TYPE":"VARCHAR2"  }
            , {"COLUMN_NAME":"NRO_CHAPA"              , "DATA_TYPE":"VARCHAR2"  }
            , {"COLUMN_NAME":"COD_PROVEEDOR_REF"      , "DATA_TYPE":"VARCHAR2"  }
            , {"COLUMN_NAME":"COD_USU_ESTADO"         , "DATA_TYPE":"VARCHAR2"  }
            , {"COLUMN_NAME":"NRO_TIMBRADO"           , "DATA_TYPE":"NUMBER"    }
            , {"COLUMN_NAME":"PEDIDO_REF"             , "DATA_TYPE":"VARCHAR2"  }
            , {"COLUMN_NAME":"NRO_REGIMEN"            , "DATA_TYPE":"VARCHAR2"  }
            , {"COLUMN_NAME":"IND_TIMBRADO"           , "DATA_TYPE":"VARCHAR2"  }
            , {"COLUMN_NAME":"AFECTA_COSTO"           , "DATA_TYPE":"VARCHAR2"  }
            , {"COLUMN_NAME":"TIP_FLETE"              , "DATA_TYPE":"VARCHAR2"  }
            , {"COLUMN_NAME":"SER_ORDEN_PAGO"         , "DATA_TYPE":"VARCHAR2"  }
            , {"COLUMN_NAME":"COD_DEPOSITO"           , "DATA_TYPE":"VARCHAR2"  }
            , {"COLUMN_NAME":"IND_RETENCION_IVA"      , "DATA_TYPE":"VARCHAR2"  }
            , {"COLUMN_NAME":"TIP_COMPRA"             , "DATA_TYPE":"VARCHAR2"  }
            , {"COLUMN_NAME":"COD_PROVEEDOR_ANT"      , "DATA_TYPE":"VARCHAR2"  }
            , {"COLUMN_NAME":"TIP_CAMBIO_DES"         , "DATA_TYPE":"NUMBER"    }
            , {"COLUMN_NAME":"TIP_MOV_CAJ"            , "DATA_TYPE":"VARCHAR2"  }
            , {"COLUMN_NAME":"SER_MOV_CAJ"            , "DATA_TYPE":"VARCHAR2"  }
            , {"COLUMN_NAME":"NRO_MOV_CAJ"            , "DATA_TYPE":"NUMBER"    }
            , {"COLUMN_NAME":"NRO_ORDEN_PAGO"         , "DATA_TYPE":"NUMBER"    }
            , {"COLUMN_NAME":"COD_CHOFER"             , "DATA_TYPE":"VARCHAR2"  }
            , {"COLUMN_NAME":"IND_GENREM"             , "DATA_TYPE":"VARCHAR2"  }
            , {"COLUMN_NAME":"TOT_DESC_VERBA"         , "DATA_TYPE":"NUMBER"    }
            , {"COLUMN_NAME":"BLOQ_X_PREC"            , "DATA_TYPE":"VARCHAR2"  }
            , {"COLUMN_NAME":"BLOQ_X_COND"            , "DATA_TYPE":"VARCHAR2"  }
            , {"COLUMN_NAME":"ESTADO_AUT"             , "DATA_TYPE":"VARCHAR2"  }
            , {"COLUMN_NAME":"IND_GENERAR"            , "DATA_TYPE":"VARCHAR2"  }
            , {"COLUMN_NAME":"IND_TIPO"               , "DATA_TYPE":"VARCHAR2"  }
            , {"COLUMN_NAME":"IND_BLOQ"               , "DATA_TYPE":"VARCHAR2"  }
            , {"COLUMN_NAME":"PORC_DESCUENTO"         , "DATA_TYPE":"NUMBER"    }
            , {"COLUMN_NAME":"TOT_DESCUENTO"          , "DATA_TYPE":"NUMBER"    }
            , {"COLUMN_NAME":"PORC_RECARGO"           , "DATA_TYPE":"NUMBER"    }
            , {"COLUMN_NAME":"TOT_RECARGO"            , "DATA_TYPE":"NUMBER"    }
            , {"COLUMN_NAME":"PORC_FLETE"             , "DATA_TYPE":"NUMBER"    }
            , {"COLUMN_NAME":"TOT_FLETE"              , "DATA_TYPE":"NUMBER"    }
            , {"COLUMN_NAME":"PORC_GASTO"             , "DATA_TYPE":"NUMBER"    }
            , {"COLUMN_NAME":"TOT_GASTO"              , "DATA_TYPE":"NUMBER"    }
            , {"COLUMN_NAME":"IND_DIF_PRECIO"         , "DATA_TYPE":"VARCHAR2"  }
            , {"COLUMN_NAME":"BLOQ_X_FLETE"           , "DATA_TYPE":"VARCHAR2"  }
            , {"COLUMN_NAME":"BLOQ_X_OTROS"           , "DATA_TYPE":"VARCHAR2"  }
            , {"COLUMN_NAME":"IND_AUTO_IMPRESO"       , "DATA_TYPE":"VARCHAR2"  }
            , {"COLUMN_NAME":"TOTAL_FC"               , "DATA_TYPE":"NUMBER"    }
            , {"COLUMN_NAME":"FEC_VENCIMIENTO"        , "DATA_TYPE":"DATE"      }
            , {"COLUMN_NAME":"SER_RET"                , "DATA_TYPE":"VARCHAR2"  }
            , {"COLUMN_NAME":"NRO_RET"                , "DATA_TYPE":"NUMBER"    }
            , {"COLUMN_NAME":"FEC_RETENCION"          , "DATA_TYPE":"DATE"      }
            , {"COLUMN_NAME":"OBS_RET"                , "DATA_TYPE":"VARCHAR2"  }
            , {"COLUMN_NAME":"NRO_FACTURA_REF"        , "DATA_TYPE":"VARCHAR2"  }
            , {"COLUMN_NAME":"FEC_EMBARQUE"           , "DATA_TYPE":"DATE"      }
            , {"COLUMN_NAME":"FEC_LLEGADA"            , "DATA_TYPE":"DATE"      }
            , {"COLUMN_NAME":"COD_PROV_REC1"          , "DATA_TYPE":"VARCHAR2"  }
            , {"COLUMN_NAME":"COD_PROV_REC2"          , "DATA_TYPE":"VARCHAR2"  }
            , {"COLUMN_NAME":"COD_PROV_REC3"          , "DATA_TYPE":"VARCHAR2"  }
            , {"COLUMN_NAME":"TOT_RECARGO2"           , "DATA_TYPE":"NUMBER"    }
            , {"COLUMN_NAME":"TOT_RECARGO3"           , "DATA_TYPE":"NUMBER"    }
            , {"COLUMN_NAME":"FEC_ANULADO"            , "DATA_TYPE":"DATE"      }
            , {"COLUMN_NAME":"ANULADO_POR"            , "DATA_TYPE":"VARCHAR2"  }
            , {"COLUMN_NAME":"TIPO_COMPRA"            , "DATA_TYPE":"VARCHAR2"  }
            , {"COLUMN_NAME":"REC_PROVEEDOR"          , "DATA_TYPE":"VARCHAR2"  }
            , {"COLUMN_NAME":"COMENTARIO"             , "DATA_TYPE":"VARCHAR2"  }
            , {"COLUMN_NAME":"IND_TIPO_FACTURA"       , "DATA_TYPE":"VARCHAR2"  }
          ],
   pk:   [ { COLUMN_NAME: 'COD_EMPRESA'    , POSITION: 1 },
           { COLUMN_NAME: 'TIP_COMPROBANTE', POSITION: 2 },
           { COLUMN_NAME: 'SER_COMPROBANTE', POSITION: 3 },
           { COLUMN_NAME: 'NRO_COMPROBANTE', POSITION: 4 },
           { COLUMN_NAME: 'COD_PROVEEDOR'  , POSITION: 5 }],
   },
  ]