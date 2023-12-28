const express         = require('express');
const router          = express.Router();

const getSucursal     = require('../../../controller/public/infoSucursal/getSucursal');

module.exports = function(){
    router.post('/pb/infoSucursal'  , getSucursal.main);
    return router;
}