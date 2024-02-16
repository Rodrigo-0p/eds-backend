
module.exports = [
  {
    table: 'ST_NOTAS_ENVIO_CAB',
    column: [{"COLUMN_NAME":"COD_EMPRESA"           , "DATA_TYPE":"VARCHAR2"    }
            ,{"COLUMN_NAME":"TIP_COMPROBANTE"       , "DATA_TYPE":"VARCHAR2"    }
            ,{"COLUMN_NAME":"SER_COMPROBANTE"       , "DATA_TYPE":"VARCHAR2"    }
            ,{"COLUMN_NAME":"NRO_COMPROBANTE"       , "DATA_TYPE":"NUMBER"      }
            ,{"COLUMN_NAME":"COD_SUCURSAL"          , "DATA_TYPE":"VARCHAR2"    }
            ,{"COLUMN_NAME":"FEC_COMPROBANTE"       , "DATA_TYPE":"DATE"        }
            ,{"COLUMN_NAME":"COD_MOTIVO"            , "DATA_TYPE":"VARCHAR2"    }
            ,{"COLUMN_NAME":"COMENTARIO"            , "DATA_TYPE":"VARCHAR2"    }
            ,{"COLUMN_NAME":"TIP_CAMBIO_US"         , "DATA_TYPE":"NUMBER"      }
            ,{"COLUMN_NAME":"COD_USUARIO"           , "DATA_TYPE":"VARCHAR2"    }
            ,{"COLUMN_NAME":"FEC_ALTA"              , "DATA_TYPE":"DATE"        }
            ,{"COLUMN_NAME":"COD_USU_MODIF"         , "DATA_TYPE":"VARCHAR2"    }
            ,{"COLUMN_NAME":"FEC_MODIF"             , "DATA_TYPE":"DATE"        }
            ,{"COLUMN_NAME":"ESTADO"                , "DATA_TYPE":"VARCHAR2"    }
            ,{"COLUMN_NAME":"FEC_ESTADO"            , "DATA_TYPE":"DATE"        }
            ,{"COLUMN_NAME":"TIP_COMPROBANTE_REF"   , "DATA_TYPE":"VARCHAR2"    }
            ,{"COLUMN_NAME":"SER_COMPROBANTE_REF"   , "DATA_TYPE":"VARCHAR2"    }
            ,{"COLUMN_NAME":"NRO_COMPROBANTE_REF"   , "DATA_TYPE":"NUMBER"      }
            ,{"COLUMN_NAME":"TIP_PLANILLA"          , "DATA_TYPE":"VARCHAR2"    }
            ,{"COLUMN_NAME":"NRO_PLANILLA"          , "DATA_TYPE":"NUMBER"      }
            ,{"COLUMN_NAME":"TIP_COMP_REF"          , "DATA_TYPE":"VARCHAR2"    }
            ,{"COLUMN_NAME":"SER_COMP_REF"          , "DATA_TYPE":"VARCHAR2"    }
            ,{"COLUMN_NAME":"NRO_COMP_REF"          , "DATA_TYPE":"NUMBER"      }
            ,{"COLUMN_NAME":"USA_WMS"               , "DATA_TYPE":"VARCHAR2"    }
            ,{"COLUMN_NAME":"COD_DEPOSITO"          , "DATA_TYPE":"VARCHAR2"    }
            ,{"COLUMN_NAME":"COD_DIRECCION"         , "DATA_TYPE":"VARCHAR2"    }
            ,{"COLUMN_NAME":"COD_ARTICULO"          , "DATA_TYPE":"VARCHAR2"    }
            ,{"COLUMN_NAME":"TIP_MOV"               , "DATA_TYPE":"VARCHAR2"    }
            ,{"COLUMN_NAME":"COD_TIPO"              , "DATA_TYPE":"VARCHAR2"    }
            ,{"COLUMN_NAME":"TIP_TRANS"             , "DATA_TYPE":"VARCHAR2"    }
            ,{"COLUMN_NAME":"COD_DIRECCION_RES"     , "DATA_TYPE":"VARCHAR2"    }
            ,{"COLUMN_NAME":"CANTIDAD_RES"          , "DATA_TYPE":"NUMBER"      }
            ,{"COLUMN_NAME":"NRO_LOTE_RES"          , "DATA_TYPE":"VARCHAR2"    }
            ,{"COLUMN_NAME":"FEC_VENCIMIENTO_RES"   , "DATA_TYPE":"DATE"        }
            ,{"COLUMN_NAME":"COD_UNID_MED_RES"      , "DATA_TYPE":"VARCHAR2"    }
            ,{"COLUMN_NAME":"CALL_01"               , "DATA_TYPE":"VARCHAR2"    }
            ,{"COLUMN_NAME":"CALL_02"               , "DATA_TYPE":"VARCHAR2"    }
            ,{"COLUMN_NAME":"PRED_01"               , "DATA_TYPE":"VARCHAR2"    }
            ,{"COLUMN_NAME":"PRED_02"               , "DATA_TYPE":"VARCHAR2"    }
            ,{"COLUMN_NAME":"PORC_REAB"             , "DATA_TYPE":"NUMBER"      }
            ,{"COLUMN_NAME":"COD_EMPLEADO"          , "DATA_TYPE":"VARCHAR2"    }
          ],
   pk:   [{ COLUMN_NAME: 'COD_EMPRESA'    , POSITION: 1 },
          { COLUMN_NAME: 'TIP_COMPROBANTE', POSITION: 2 },
          { COLUMN_NAME: 'SER_COMPROBANTE', POSITION: 3 },
          { COLUMN_NAME: 'NRO_COMPROBANTE', POSITION: 4 }],
  },
  {
    table: 'ST_NOTAS_ENVIO_DET',
    column: [{"COLUMN_NAME":"COD_EMPRESA"         , "DATA_TYPE":"VARCHAR2"      }
            ,{"COLUMN_NAME":"TIP_COMPROBANTE"     , "DATA_TYPE":"VARCHAR2"      }
            ,{"COLUMN_NAME":"SER_COMPROBANTE"     , "DATA_TYPE":"VARCHAR2"      }
            ,{"COLUMN_NAME":"NRO_COMPROBANTE"     , "DATA_TYPE":"NUMBER"        }
            ,{"COLUMN_NAME":"NRO_ORDEN"           , "DATA_TYPE":"NUMBER"        }
            ,{"COLUMN_NAME":"COD_SUCURSAL"        , "DATA_TYPE":"VARCHAR2"      }
            ,{"COLUMN_NAME":"COD_DEPOSITO"        , "DATA_TYPE":"VARCHAR2"      }
            ,{"COLUMN_NAME":"COD_DEPOSITO_ENT"    , "DATA_TYPE":"VARCHAR2"      }
            ,{"COLUMN_NAME":"COD_ARTICULO"        , "DATA_TYPE":"VARCHAR2"      }
            ,{"COLUMN_NAME":"NRO_LOTE"            , "DATA_TYPE":"VARCHAR2"      }
            ,{"COLUMN_NAME":"COD_UNIDAD_MEDIDA"   , "DATA_TYPE":"VARCHAR2"      }
            ,{"COLUMN_NAME":"CANTIDAD"            , "DATA_TYPE":"NUMBER"        }
            ,{"COLUMN_NAME":"CANTIDAD_UB"         , "DATA_TYPE":"NUMBER"        }
            ,{"COLUMN_NAME":"COSTO_ULTIMO"        , "DATA_TYPE":"NUMBER"        }
            ,{"COLUMN_NAME":"COSTO_PROMEDIO"      , "DATA_TYPE":"NUMBER"        }
            ,{"COLUMN_NAME":"COSTO_ULTIMO_US"     , "DATA_TYPE":"NUMBER"        }
            ,{"COLUMN_NAME":"COSTO_PROMEDIO_US"   , "DATA_TYPE":"NUMBER"        }
            ,{"COLUMN_NAME":"COD_CAUSA"           , "DATA_TYPE":"VARCHAR2"      }
            ,{"COLUMN_NAME":"FEC_VENCIMIENTO"     , "DATA_TYPE":"DATE"          }
            ,{"COLUMN_NAME":"TIP_COMP_REF"        , "DATA_TYPE":"VARCHAR2"      }
            ,{"COLUMN_NAME":"SER_COMP_REF"        , "DATA_TYPE":"VARCHAR2"      }
            ,{"COLUMN_NAME":"NRO_COMP_REF"        , "DATA_TYPE":"NUMBER"        }
            ,{"COLUMN_NAME":"NRO_ORDEN_REF"       , "DATA_TYPE":"NUMBER"        }
            ,{"COLUMN_NAME":"COD_DIRECCION"       , "DATA_TYPE":"VARCHAR2"      }
            ,{"COLUMN_NAME":"COD_DIRECCION_DES"   , "DATA_TYPE":"VARCHAR2"      }
            ,{"COLUMN_NAME":"ESTADO"              , "DATA_TYPE":"VARCHAR2"      }
            ,{"COLUMN_NAME":"USA_WMS"             , "DATA_TYPE":"VARCHAR2"      }
            ,{"COLUMN_NAME":"TIP_MOV"             , "DATA_TYPE":"VARCHAR2"      }
            ,{"COLUMN_NAME":"PALET_NRO"           , "DATA_TYPE":"VARCHAR2"      }
            ,{"COLUMN_NAME":"FEC_VENCIM_01"       , "DATA_TYPE":"DATE"          }
            ,{"COLUMN_NAME":"COD_UNID_MED_RES"    , "DATA_TYPE":"VARCHAR2"      }
            ,{"COLUMN_NAME":"CANTIDAD_RES"        , "DATA_TYPE":"NUMBER"        }
            ,{"COLUMN_NAME":"CANTIDAD_UB_RES"     , "DATA_TYPE":"NUMBER"        }
            ,{"COLUMN_NAME":"COD_SUCURSAL_ENT"    , "DATA_TYPE":"VARCHAR2"      }
          ],
    pk:  [
      { COLUMN_NAME: 'COD_EMPRESA'    , POSITION: 1 },
      { COLUMN_NAME: 'TIP_COMPROBANTE', POSITION: 2 },
      { COLUMN_NAME: 'SER_COMPROBANTE', POSITION: 3 },
      { COLUMN_NAME: 'NRO_COMPROBANTE', POSITION: 4 },
      { COLUMN_NAME: 'NRO_ORDEN'      , POSITION: 5 }
    ],
  }
]