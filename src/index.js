const app            = require('./app');
// const {logger}    = require('./utils/logger')
require('dotenv').config()
app.set('port', process.env.PORT || 3000);
app.listen(app.get('port') ,async()=>{
    // logger.info(`server listen on port ${app.get('port')} || DB connect: ${process.env.DBURL}`)
    console.log(`server listen on port ${app.get('port')} || DB connect: ${process.env.DBURL}`);
});