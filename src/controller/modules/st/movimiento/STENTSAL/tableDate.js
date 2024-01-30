
module.exports = [
  {
    table: 'ST_ENTSAL_CAB',
    column: [{"COLUMN_NAME":"COD_EMPRESA"          ,"DATA_TYPE":"VARCHAR2"  }
            ,{"COLUMN_NAME":"TIP_ENT_SAL"          ,"DATA_TYPE":"VARCHAR2"  }
            ,{"COLUMN_NAME":"SER_ENT_SAL"          ,"DATA_TYPE":"VARCHAR2"  }
            ,{"COLUMN_NAME":"NRO_ENT_SAL"          ,"DATA_TYPE":"NUMBER"    }
            ,{"COLUMN_NAME":"TIP_COMPROBANTE_REF"  ,"DATA_TYPE":"VARCHAR2"  }
            ,{"COLUMN_NAME":"SER_COMPROBANTE_REF"  ,"DATA_TYPE":"VARCHAR2"  }
            ,{"COLUMN_NAME":"NRO_COMPROBANTE_REF"  ,"DATA_TYPE":"NUMBER"    }
            ,{"COLUMN_NAME":"FEC_ENT_SAL"          ,"DATA_TYPE":"DATE"      }
            ,{"COLUMN_NAME":"COD_SUCURSAL"         ,"DATA_TYPE":"VARCHAR2"  }
            ,{"COLUMN_NAME":"COD_DEPOSITO"         ,"DATA_TYPE":"VARCHAR2"  }
            ,{"COLUMN_NAME":"COD_MOTIVO"           ,"DATA_TYPE":"VARCHAR2"  }
            ,{"COLUMN_NAME":"IND_ENT_SAL"          ,"DATA_TYPE":"VARCHAR2"  }
            ,{"COLUMN_NAME":"AFECTA_COSTO"         ,"DATA_TYPE":"VARCHAR2"  }
            ,{"COLUMN_NAME":"COD_MONEDA"           ,"DATA_TYPE":"VARCHAR2"  }
            ,{"COLUMN_NAME":"COD_PROVEEDOR"        ,"DATA_TYPE":"VARCHAR2"  }
            ,{"COLUMN_NAME":"OBSERVACION"          ,"DATA_TYPE":"VARCHAR2"  }
            ,{"COLUMN_NAME":"TIP_CAMBIO_US"        ,"DATA_TYPE":"NUMBER"    }
            ,{"COLUMN_NAME":"COD_USUARIO"          ,"DATA_TYPE":"VARCHAR2"  }
            ,{"COLUMN_NAME":"FEC_ALTA"             ,"DATA_TYPE":"DATE"      }
            ,{"COLUMN_NAME":"COD_USUARIO_MODI"     ,"DATA_TYPE":"VARCHAR2"  }
            ,{"COLUMN_NAME":"FEC_MODI"             ,"DATA_TYPE":"DATE"      }
            ,{"COLUMN_NAME":"TIP_CAMBIO"           ,"DATA_TYPE":"NUMBER"    }
            ,{"COLUMN_NAME":"ESTADO"               ,"DATA_TYPE":"VARCHAR2"  }
            ,{"COLUMN_NAME":"FEC_ESTADO"           ,"DATA_TYPE":"DATE"      }
            ,{"COLUMN_NAME":"IND_UNIDAD_MEDIDA"    ,"DATA_TYPE":"VARCHAR2"  }
            ,{"COLUMN_NAME":"COD_VEHICULO"         ,"DATA_TYPE":"VARCHAR2"  }
            ,{"COLUMN_NAME":"COD_CENTRO"           ,"DATA_TYPE":"VARCHAR2"  }
            ,{"COLUMN_NAME":"USA_WMS"              ,"DATA_TYPE":"VARCHAR2"  }
            ,{"COLUMN_NAME":"COD_CAT_ALM"          ,"DATA_TYPE":"VARCHAR2"  }
            ,{"COLUMN_NAME":"BLOQ_X_JEFE"          ,"DATA_TYPE":"VARCHAR2"  }
            ,{"COLUMN_NAME":"BLOQ_X_GTE"           ,"DATA_TYPE":"VARCHAR2"  }
            ,{"COLUMN_NAME":"BLOQ_X_DIREC"         ,"DATA_TYPE":"VARCHAR2"  }
            ,{"COLUMN_NAME":"AUT_JEFE"             ,"DATA_TYPE":"VARCHAR2"  }
            ,{"COLUMN_NAME":"AUT_GERENTE"          ,"DATA_TYPE":"VARCHAR2"  }
            ,{"COLUMN_NAME":"AUT_DIRECTOR"         ,"DATA_TYPE":"VARCHAR2"  }
            ,{"COLUMN_NAME":"COD_POTRERO"          ,"DATA_TYPE":"VARCHAR2"  }
            ,{"COLUMN_NAME":"COD_EMPLEADO"         ,"DATA_TYPE":"VARCHAR2"  }
            ,{"COLUMN_NAME":"TIPO_COMPRA"          ,"DATA_TYPE":"VARCHAR2"  }
          ],
   pk:  [
          { COLUMN_NAME: 'COD_EMPRESA', POSITION: 1 },
          { COLUMN_NAME: 'TIP_ENT_SAL', POSITION: 2 },
          { COLUMN_NAME: 'SER_ENT_SAL', POSITION: 3 },
          { COLUMN_NAME: 'NRO_ENT_SAL', POSITION: 4 }
        ],
  },
  {
    table: 'ST_ENTSAL_DET',
    column: [{"COLUMN_NAME":"COD_EMPRESA"         ,"DATA_TYPE":"VARCHAR2"   }
            ,{"COLUMN_NAME":"TIP_ENT_SAL"         ,"DATA_TYPE":"VARCHAR2"   }
            ,{"COLUMN_NAME":"SER_ENT_SAL"         ,"DATA_TYPE":"VARCHAR2"   }
            ,{"COLUMN_NAME":"NRO_ENT_SAL"         ,"DATA_TYPE":"NUMBER"     }
            ,{"COLUMN_NAME":"NRO_ORDEN"           ,"DATA_TYPE":"NUMBER"     }
            ,{"COLUMN_NAME":"COD_SUCURSAL"        ,"DATA_TYPE":"VARCHAR2"   }
            ,{"COLUMN_NAME":"IND_ENT_SAL"         ,"DATA_TYPE":"VARCHAR2"   }
            ,{"COLUMN_NAME":"AFECTA_COSTO"        ,"DATA_TYPE":"VARCHAR2"   }
            ,{"COLUMN_NAME":"COD_ARTICULO"        ,"DATA_TYPE":"VARCHAR2"   }
            ,{"COLUMN_NAME":"COSTO_ULTIMO"        ,"DATA_TYPE":"NUMBER"     }
            ,{"COLUMN_NAME":"COSTO_PROMEDIO"      ,"DATA_TYPE":"NUMBER"     }
            ,{"COLUMN_NAME":"CANTIDAD"            ,"DATA_TYPE":"NUMBER"     }
            ,{"COLUMN_NAME":"COD_UNIDAD_MEDIDA"   ,"DATA_TYPE":"VARCHAR2"   }
            ,{"COLUMN_NAME":"CANTIDAD_UB"         ,"DATA_TYPE":"NUMBER"     }
            ,{"COLUMN_NAME":"NRO_LOTE"            ,"DATA_TYPE":"VARCHAR2"   }
            ,{"COLUMN_NAME":"FEC_VENCIMIENTO"     ,"DATA_TYPE":"DATE"       }
            ,{"COLUMN_NAME":"COSTO_UNITARIO"      ,"DATA_TYPE":"NUMBER"     }
            ,{"COLUMN_NAME":"COSTO_UB"            ,"DATA_TYPE":"NUMBER"     }
            ,{"COLUMN_NAME":"COD_DIRECCION"       ,"DATA_TYPE":"VARCHAR2"   }
            ,{"COLUMN_NAME":"MONTO_TOTAL"         ,"DATA_TYPE":"NUMBER"     }
            ,{"COLUMN_NAME":"COSTO_ULTIMO_US"     ,"DATA_TYPE":"NUMBER"     }
            ,{"COLUMN_NAME":"COSTO_PROMEDIO_US"   ,"DATA_TYPE":"NUMBER"     }
            ,{"COLUMN_NAME":"COD_CAUSA"           ,"DATA_TYPE":"VARCHAR2"   }
            ,{"COLUMN_NAME":"PESO"                ,"DATA_TYPE":"NUMBER"     }
            ,{"COLUMN_NAME":"PESO_TOTAL"          ,"DATA_TYPE":"NUMBER"     }
            ,{"COLUMN_NAME":"COSTO_CON_IVA_GS"    ,"DATA_TYPE":"NUMBER"     }
            ,{"COLUMN_NAME":"GASTO_CON_IVA_GS"    ,"DATA_TYPE":"NUMBER"     }
            ,{"COLUMN_NAME":"PRECIO_ULTIMO_COSTO" ,"DATA_TYPE":"NUMBER"     }
            ,{"COLUMN_NAME":"COSTO_ULT_CON_IVA_GS","DATA_TYPE":"NUMBER"     }
          ],
    pk: [
      { COLUMN_NAME: 'COD_EMPRESA', POSITION: 1 },
      { COLUMN_NAME: 'TIP_ENT_SAL', POSITION: 2 },
      { COLUMN_NAME: 'SER_ENT_SAL', POSITION: 3 },
      { COLUMN_NAME: 'NRO_ENT_SAL', POSITION: 4 },
      { COLUMN_NAME: 'NRO_ORDEN', POSITION: 5 }
    ],
  }
]