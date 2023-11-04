const express         = require('express');
const router          = express.Router();

const getEmpresa      = require('../../../controller/public/infoEmpresa/getEmpresa');

module.exports = function(){
    router.post('/pb/infoEmpresa'  , getEmpresa.main);
    return router;
}